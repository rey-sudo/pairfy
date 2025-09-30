<template>
  <footer class="footer" role="contentinfo">
    <div class="footer-container">
      <nav class="footer-columns" aria-label="Footer Navigation">

        <!-- Company -->
        <div class="footer-column">
          <h2 class="footer-title">DAO</h2>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/team">Our Team</a></li>
            <li><a href="/blog">Blog & News</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/partners">Partners</a></li>
          </ul>
        </div>

        <!-- Help -->
        <div class="footer-column">
          <h2 class="footer-title">Customer Support</h2>
          <ul>
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/support">Help Center</a></li>
            <li><a href="/shipping">Shipping Info</a></li>
            <li><a href="/returns">Returns & Refunds</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="footer-column">
          <h2 class="footer-title">Legal</h2>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/cookies">Cookie Settings</a></li>
            <li><a href="/security">Security</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-column">
          <h2 class="footer-title">Contact</h2>
          <ul>
            <li><a href="mailto:sudo.delete.evil@gmail.com">sudo.delete.evil@gmail.com</a></li>
            <li>Naples, Florida</li>
          </ul>
        </div>

        <!-- Social -->
        <div class="footer-column">
          <h2 class="footer-title">Follow Us</h2>
          <ul class="social-links">
            <li><a href="#" aria-label="YouTube">YouTube</a></li>
            <li><a href="#" aria-label="Instagram">Instagram</a></li>
            <li><a href="#" aria-label="Facebook">Facebook</a></li>
            <li><a href="#" aria-label="X (Twitter)">X</a></li>
            <li><a href="#" aria-label="GitHub">GitHub</a></li>
          </ul>
        </div>

      </nav>

      <div class="footer-bottom">
        <p>&copy; 2025 Pairfy LLC. All rights reserved.</p>
        <div class="payment-icons">
          <!-- Optional: Add payment method icons here -->
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>

</script>

<style scoped>
.footer {
  border-top: 1px solid var(--border-a);
  font-size: var(--text-size-1);
  box-sizing: border-box;
  color: var(--text-b);
  padding: 4rem 1rem;
  width: 100%;
}

.footer-container {
  max-width: var(--body-a);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: var(--text-size-2);
  color: var(--text-a);
  margin-bottom: 1rem;
  font-weight: 700;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column ul li {
  margin-bottom: 1rem;
}

.footer-column ul li a {
  color: inherit;
  text-decoration: none;
  transition: var(--transition-a);
}

.footer-column ul li a:hover {
  text-decoration: underline;
}

.social-links li {
  display: flex;
  align-items: center;
}

.footer-bottom {
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>


<style scoped>
@media (max-width: 480px) {

  .footer{
    padding: 1rem;
  }

  .footer-columns{
    gap: 1rem;
    display: flex;
    flex-direction: column;
  }
}

@media (min-width: 481px) and (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) and (max-width: 1599px) {}

@media (min-width: 1600px) {}

</style>