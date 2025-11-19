document.addEventListener('DOMContentLoaded', function() {
    // Get the post slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post') || getSlugFromPath();
    
    if (postSlug) {
        loadBlogPost(postSlug);
    } else {
        showError('Post not found');
    }

    // Load common sections
    loadNewsletterSection();
    loadFooter();
});

function getSlugFromPath() {
    const path = window.location.pathname;
    const match = path.match(/\/([^\/]+)\.html$/);
    return match ? match[1].replace('blog-post-', '') : null;
}

function loadBlogPost(slug) {
     fetch(`content/blogs/${slug}.json`)
        .then(response => {
            if (!response.ok) throw new Error('Post not found');
            return response.json();
        })
        .then(post => {
            displayBlogPost(post);
            loadRelatedPosts(post.category, post.title);
        })
        .catch(error => {
            console.error('Error loading blog post:', error);
            showError('Blog post not found. <a href="blog.html">Return to blog</a>');
        });
}

function displayBlogPost(post) {
    const postContent = document.getElementById('blog-post-content');
    
    postContent.innerHTML = `
        <article class="single-blog-post">
            <div class="post-header">
                <span class="post-category">${post.category}</span>
                <h1>${post.title}</h1>
                <div class="post-meta">
                    <div class="author-info">
                        <span>By <strong>${post.author}</strong></span>
                    </div>
                    <div class="post-details">
                        <span>${formatDate(post.date)}</span>
                        <span>${post.reading_time}</span>
                    </div>
                </div>
            </div>
            
            <div class="featured-image">
                <img src="${post.image}" alt="${post.alt}">
            </div>
            
            <div class="post-content">
                ${marked.parse(post.body)}
            </div>
            
            <div class="post-tags">
                <h4>Tags:</h4>
                <div class="tags">
                    ${post.tags.map(tag => `<a href="blog.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>`).join('')}
                </div>
            </div>
            
            <div class="post-navigation">
                <a href="blog.html" class="btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back to Blog
                </a>
            </div>
        </article>
    `;
    
    // Update page title
    document.title = `${post.title} - DCM Financing Blog`;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function loadRelatedPosts(category, currentTitle) {
    fetch('content/pages/blog.json')
        .then(response => response.json())
        .then(data => {
            const allPosts = [data.featured_post, ...data.blog_posts];
            const relatedPosts = allPosts.filter(post => 
                post.category === category && post.title !== currentTitle
            ).slice(0, 3);
            
            displayRelatedPosts(relatedPosts);
        })
        .catch(error => console.error('Error loading related posts:', error));
}

function displayRelatedPosts(posts) {
    const relatedGrid = document.getElementById('related-grid');
    const relatedSection = document.getElementById('related-posts');
    
    if (posts.length === 0) {
        relatedSection.style.display = 'none';
        return;
    }
    
    relatedGrid.innerHTML = posts.map(post => `
        <article class="blog-post">
            <div class="post-image">
                <img src="${post.image}" alt="${post.alt}">
            </div>
            <div class="post-content">
                <span class="post-category">${post.category}</span>
                <h3>${post.title}</h3>
                <p class="post-meta">By <strong>${post.author}</strong> | ${post.date}</p>
                <p class="post-excerpt">${post.excerpt}</p>
                <a href="blog-post.html?post=${generateSlug(post.title)}" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `).join('');
}

function generateSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function showError(message) {
    const postContent = document.getElementById('blog-post-content');
    postContent.innerHTML = `
        <div class="error-message">
            <h2>Oops!</h2>
            <p>${message}</p>
            <a href="blog.html" class="btn-primary">Return to Blog</a>
        </div>
    `;
}

// Load common sections
function loadNewsletterSection() {
    fetch('content/pages/blog.json')
        .then(response => response.json())
        .then(data => {
            const newsletterSection = document.getElementById('newsletter-section');
            newsletterSection.innerHTML = `
                <div class="container">
                    <div class="newsletter-content">
                        <h2>${data.newsletter_section.title}</h2>
                        <p>${data.newsletter_section.description}</p>
                        <form class="newsletter-form">
                            <input type="email" placeholder="Your email address" required>
                            <button type="submit" class="btn-primary">${data.newsletter_section.button_text}</button>
                        </form>
                    </div>
                </div>
            `;
            
            // Add newsletter form handler
            const newsletterForm = newsletterSection.querySelector('.newsletter-form');
            newsletterForm.addEventListener('submit', handleNewsletterSubmit);
        });
}

function loadFooter() {
    fetch('content/pages/blog.json')
        .then(response => response.json())
        .then(data => {
            const footerSection = document.getElementById('site-footer');
            footerSection.innerHTML = `
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <div class="footer-logo">
                                <img src="assets/dcm_logo.png" alt="DCM Financing">
                            </div>
                            <p>${data.footer.description}</p>
                            <div class="social-links">
                                ${data.footer.social_links.map(social => `
                                    <a href="${social.url}"><i class="${social.icon}"></i></a>
                                `).join('')}
                            </div>
                        </div>
                        <div class="footer-section">
                            <h3>Quick Links</h3>
                            <ul>
                                ${data.footer.quick_links.map(link => `
                                    <li><a href="${link.url}">${link.label}</a></li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h3>Services</h3>
                            <ul>
                                ${data.footer.service_links.map(service => `
                                    <li><a href="${service.url}">${service.label}</a></li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h3>Contact Us</h3>
                            <ul class="contact-info">
                                <li><i class="fas fa-map-marker-alt"></i> ${data.footer.address}</li>
                                <li><i class="fas fa-phone-alt"></i> ${data.footer.phone}</li>
                                <li><i class="fas fa-envelope"></i> ${data.footer.email}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>${data.footer.copyright}</p>
                    </div>
                </div>
            `;
        });
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with: ${email}\n\nYou'll receive our latest insights soon!`);
    this.reset();
}