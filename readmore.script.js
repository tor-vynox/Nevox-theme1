document.addEventListener('DOMContentLoaded', function() {
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const content = document.getElementById(targetId);
            
            if (content.classList.contains('expanded')) {
                // Collapse content
                content.classList.remove('expanded');
                this.textContent = 'Read More';
                this.style.background = 'linear-gradient(to right, #667eea, #764ba2)';
            } else {
                // Expand content
                content.classList.add('expanded');
                this.textContent = 'Read Less';
                this.style.background = 'linear-gradient(to right, #ff4757, #ff6b81)';
            }
        });
    });
    
    // Like button functionality
    const likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(btn => {
        let likeCount = parseInt(btn.textContent.match(/\d+/)[0]);
        let liked = false;
        
        btn.addEventListener('click', function() {
            if (!liked) {
                likeCount++;
                liked = true;
                this.innerHTML = `❤️ Liked (${likeCount})`;
                this.style.background = 'linear-gradient(to right, #ff4757, #ff6b81)';
                this.style.color = 'white';
            } else {
                likeCount--;
                liked = false;
                this.innerHTML = `❤️ Like (${likeCount})`;
                this.style.background = '#f8f9fa';
                this.style.color = '#333';
            }
        });
    });
});
