document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filterSelect = document.getElementById('filterSelect');
    const postsContainer = document.getElementById('postsContainer');
    const searchInfo = document.getElementById('searchInfo');
    
    // Render posts
    function renderPosts(posts) {
        postsContainer.innerHTML = '';
        
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            postCard.innerHTML = `
                <div class="post-header">
                    <span class="post-author">${post.author}</span>
                    <span class="post-time">${post.time}</span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-content">${post.content}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <div class="post-stats">
                    <span class="stat likes">❤️ ${post.likes} likes</span>
                    <span class="stat">💬 0 comments</span>
                    <span class="stat">🔗 0 shares</span>
                </div>
            `;
            postsContainer.appendChild(postCard);
        });
        
        searchInfo.textContent = `Found ${posts.length} posts`;
    }
    
    // Initial render
    renderPosts(postsData);
    
    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterType = filterSelect.value;
        
        const filteredPosts = postsData.filter(post => {
            const matchesSearch = 
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm) ||
                post.author.toLowerCase().includes(searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            if (filterType === 'all') return matchesSearch;
            if (filterType === 'posts') return matchesSearch;
            if (filterType === 'users') return post.author.toLowerCase().includes(searchTerm);
            if (filterType === 'tags') return post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            return false;
        });
        
        renderPosts(filteredPosts);
        
        // Update search info
        if (searchTerm === '') {
            searchInfo.innerHTML = `<p>Showing all ${postsData.length} posts</p>`;
        } else {
            searchInfo.innerHTML = `
                <p>Found ${filteredPosts.length} results for "<strong>${searchTerm}</strong>"</p>
                <p>Filter: ${filterType}</p>
            `;
        }
    }
    
    // Event Listeners
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
    filterSelect.addEventListener('change', performSearch);
    
    // Press Enter to search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Add sample tags click functionality
    setTimeout(() => {
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.addEventListener('click', function() {
                const tagText = this.textContent.substring(1);
                searchInput.value = tagText;
                filterSelect.value = 'tags';
                performSearch();
            });
        });
    }, 100);
});
