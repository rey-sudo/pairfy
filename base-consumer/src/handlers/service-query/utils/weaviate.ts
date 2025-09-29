import weaviate from "weaviate-ts-client";
import axiosRetry from "axios-retry";
import axios from "axios";
import { logger } from "@lovelacers/common";

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error),
});

export const weaviateClient = weaviate.client({
  scheme: "http",
  host: process.env.HANDLER_WEAVIATE_HOST as string,
});

export async function createProductIndex(product: any): Promise<boolean> {
  try {
    const prompt = [product.name, product.category, product.description.text]
      .filter(Boolean)
      .join(" ");

    const { data } = await axios.post<{ embedding: number[] }>(
      `http://${process.env.HANDLER_EMBEDDING_HOST as string}`,
      {
        model: "nomic-embed-text",
        prompt,
      }
    );

    if (!Array.isArray(data.embedding)) {
      logger.error({
        service: "service-query-consumer",
        event: "weaviate.error",
        message: `invalid embedding format ${data?.embedding}`,
      });
      return false;
    }
    const defaultValues = {
      available: 0,
      rating: 0,
      rating_value: 0,
      sold: 0,
    };

    const { id, ...productData } = product;

    await weaviateClient.data
      .creator()
      .withClassName("ProductV1")
      .withProperties({
        ...productData,
        id_: id,
        discount: Boolean(product.discount),
        moderated: Boolean(product.moderated),
        description: product.description.text,
        ...defaultValues,
      })
      .withVector(data.embedding)
      .do();

    return true;
  } catch (error) {
    logger.error({
      service: "service-query-consumer",
      event: "weaviate.error",
      message: `Weaviate create product index error`,
      error,
    });

    return false;
  }
}

export async function updateProductIndex(product: any): Promise<boolean> {
  try {
    const weaviateId = await getProductId(product.id);

    if (!weaviateId) {
      logger.error({
        service: "service-query-consumer",
        event: "weaviate.error",
        message: `Product with id_ ${product.id} not found`,
      });
      return false;
    }

    const prompt = [product.name, product.category, product.description.text]
      .filter(Boolean)
      .join(" ");

    const { data } = await axios.post<{ embedding: number[] }>(
      `http://${process.env.HANDLER_EMBEDDING_HOST as string}`,
      {
        model: "nomic-embed-text",
        prompt,
      }
    );

    if (!Array.isArray(data.embedding)) {
      logger.error({
        service: "service-query-consumer",
        event: "weaviate.error",
        message: `invalid embedding format ${data?.embedding}`,
      });
      return false;
    }

    const { id, ...productData } = product;

    await weaviateClient.data
      .updater()
      .withClassName("ProductV1")
      .withId(weaviateId)
      .withProperties({
        ...productData,
        id_: id,
        discount: Boolean(product.discount),
        moderated: Boolean(product.moderated),
        description: product.description.text,
      })
      .withVector(data.embedding)
      .do();

    return true;
  } catch (error) {
    logger.error({
      service: "service-query-consumer",
      event: "weaviate.update.error",
      message: `Weaviate update product index error`,
      error,
    });

    return false;
  }
}

export async function deleteProductIndex(productId: string): Promise<boolean> {
  try {
    const weaviateId = await getProductId(productId);

    if (!weaviateId) {
      logger.error({
        service: "service-query-consumer",
        event: "weaviate.error",
        message: `Product with id_ ${productId} not found`,
      });
      return false;
    }
    await weaviateClient.data
      .deleter()
      .withClassName("ProductV1")
      .withId(weaviateId)
      .do();

    return true;
  } catch (error) {
    logger.error({
      service: "service-query-consumer",
      event: "weaviate.delete.error",
      message: `Failed to delete product with id_ ${productId}`,
      error,
    });

    return false;
  }
}

//////////////////////////////////////////////////////////////

async function getProductId(pid: string): Promise<string | false> {

  try {
    const result = await weaviateClient.graphql
      .get()
      .withClassName("ProductV1")
      .withFields("id_ _additional { id }")
      .withWhere({
        path: ["id_"],
        operator: "Equal",
        valueString: pid,
      })
      .do();

    const resultArray = result?.data?.Get?.ProductV1;

    const products = Array.isArray(resultArray) ? resultArray : [];

    if (products.length === 0) {
      logger.error({
        service: "service-query-consumer",
        event: "weaviate.error",
        message: `Product with id_ ${pid} not found`,
      });
      return false;
    }

    return products[0]._additional?.id;
  } catch (error: any) {
    logger.error({
      service: "service-query-consumer",
      event: "weaviate.error",
      message: `Error fetching product with id_ ${pid}: ${error.message}`,
      stack: error.stack,
    });
    return false;
  }
}
