// NEVOX Ecosystem - Main JavaScript File

// Global variables
let currentUser = null;
let currentFeed = 'post';
let onlineUsers = 1;

// Sample posts data stored in localStorage
const SAMPLE_POSTS = [
    {
        id: '1',
        title: 'Welcome to NEVOX Ecosystem! 🎉',
        content: 'Welcome to NEVOX - the future of social networking! This platform combines AI, real-time interaction, and user-friendly features to create the ultimate social experience. Start by creating your own posts, exploring content, and connecting with others.',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        author: 'NEVOX Team',
        likes_count: 42,
        comments_count: 8,
        views: 150,
        created_at: new Date().toISOString(),
        likedBy: []
    },
    {
        id: '2',
        title: 'NEVOX AI Features Explained 🤖',
        content: 'Discover our powerful AI features: 1) AI Assistant for real-time help, 2) Smart content recommendations, 3) Automated moderation, 4) Personalized feeds. Try the AI Assistant in the sidebar!',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        author: 'AI Department',
        likes_count: 89,
        comments_count: 23,
        views: 320,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        likedBy: []
    },
    {
        id: '3',
        title: 'How to Earn Points on NEVOX 🏆',
        content: 'Earn points by: 1) Creating posts (+10 pts), 2) Liking content (+5 pts), 3) Commenting (+2 pts), 4) Sharing (+3 pts), 5) Daily login (+5 pts). Points unlock premium features!',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        author: 'Rewards System',
        likes_count: 56,
        comments_count: 15,
        views: 210,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        likedBy: []
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
    loadThemeSelector();
    await checkAuth();
    loadFeed('post');
    setupEventListeners();
    updateOnlineCount();
});

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchPosts(searchInput.value);
        }
    });
    
    // Click outside to close modals
    document.addEventListener('click', (e) => {
        const aiModal = document.getElementById('aiModal');
        const profileModal = document.getElementById('profileModal');
        const sidebar = document.getElementById('sidebar');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (aiModal.style.display === 'flex' && !e.target.closest('.ai-modal-content')) {
            closeAIAssistant();
        }
        
        if (profileModal.style.display === 'flex' && !e.target.closest('.profile-content')) {
            closeProfile();
        }
        
        if (window.innerWidth <= 1024 && 
            !sidebar.contains(e.target) && 
            !mobileMenu.contains(e.target) && 
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

// Initialize app
async function initializeApp() {
    console.log('NEVOX Ecosystem Initializing...');
    document.getElementById('lastDate').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Initialize localStorage if empty
    if (!localStorage.getItem('newox-posts')) {
        localStorage.setItem('newox-posts', JSON.stringify(SAMPLE_POSTS));
    }
    
    // Initialize user profiles
    if (!localStorage.getItem('newox-users')) {
        localStorage.setItem('newox-users', JSON.stringify({}));
    }
}

// Load feed from localStorage
window.loadFeed = function(type = 'post', event = null) {
    currentFeed = type;
    const feed = document.getElementById('feed');
    
    // Update active sidebar item
    document.querySelectorAll('.nvx-sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Handle event parameter
    if (event) {
        const clickedElement = event.target.closest('.nvx-sidebar-item');
        if (clickedElement) {
            clickedElement.classList.add('active');
        }
    } else {
        const items = document.querySelectorAll('.nvx-sidebar-item');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if ((type === 'post' && text.includes('home')) || 
                text.includes(type.toLowerCase())) {
                item.classList.add('active');
            }
        });
    }
    
    // Show loading
    feed.innerHTML = `
        <div class="nvx-loader">
            <div class="spinner"></div>
            <p>Loading ${type} content...</p>
        </div>
    `;
    
    // Simulate loading delay
    setTimeout(() => {
        try {
            const posts = JSON.parse(localStorage.getItem('newox-posts') || '[]');
            
            let filteredPosts = [...posts];
            
            // Apply filters
            switch(type) {
                case 'popular':
                    filteredPosts.sort((a, b) => b.likes_count - a.likes_count);
                    break;
                case 'recent':
                    filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case 'video':
                    filteredPosts = posts.filter(post => 
                        post.content.toLowerCase().includes('video') || 
                        post.title.toLowerCase().includes('video')
                    );
                    break;
                case 'image':
                    filteredPosts = posts.filter(post => post.image);
                    break;
                default:
                    filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
            
            renderPosts(filteredPosts);
            
        } catch (error) {
            console.error('Error loading feed:', error);
            showNotification('Failed to load content', 'error');
            renderPosts(SAMPLE_POSTS);
        }
    }, 500);
};

// Render posts
function renderPosts(posts) {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    
    // Add create post form for logged in users
    if (currentUser) {
        const postForm = document.createElement('div');
        postForm.className = 'nvx-post-form';
        postForm.innerHTML = `
            <h3 style="margin-bottom:15px"><i class="fa-solid fa-pen"></i> Create New Post</h3>
            <input type="text" id="postTitle" placeholder="Post Title" maxlength="100">
            <textarea id="postContent" placeholder="What's on your mind?" maxlength="1000"></textarea>
            <input type="text" id="postImage" placeholder="Image URL (optional)">
            <div style="display:flex; gap:10px; justify-content:flex-end">
                <button onclick="clearPostForm()" class="nvx-btn btn-sec">Clear</button>
                <button onclick="submitPost()" class="nvx-btn btn-pri">Post</button>
            </div>
        `;
        feed.appendChild(postForm);
    }
    
    if (posts.length === 0) {
        feed.innerHTML += `
            <div style="text-align:center; padding:50px; color:var(--nvx-text-sec)">
                <i class="fa-regular fa-newspaper" style="font-size:48px; margin-bottom:20px"></i>
                <h3>No posts yet</h3>
                <p>Be the first to create a post!</p>
                ${!currentUser ? '<button onclick="login()" class="nvx-btn btn-pri" style="margin-top:20px">Login to Post</button>' : ''}
            </div>
        `;
        return;
    }
    
    posts.forEach(post => {
        feed.appendChild(createPostElement(post));
    });
}

// Create post element
function createPostElement(post) {
    const postElement = document.createElement('article');
    postElement.className = 'nvx-post';
    
    // Check if current user liked this post
    const isLiked = currentUser && post.likedBy && post.likedBy.includes(currentUser.email);
    
    postElement.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:12px;color:var(--nvx-text-sec)">
            <i class="fa-regular fa-calendar"></i> ${formatDate(post.created_at)}
            <i class="fa-regular fa-user"></i> ${post.author || 'User'}
            <span style="margin-left:auto">
                <i class="fa-regular fa-eye"></i> ${post.views || 0}
            </span>
        </div>
        <h2 class="post-title">${escapeHtml(post.title)}</h2>
        ${post.image ? `<img src="${post.image}" class="post-img" loading="lazy" alt="${post.title}" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'">` : ''}
        <div style="margin-bottom:15px; line-height:1.6;">${escapeHtml(post.content)}</div>
        
        <div class="nvx-reactions">
            <button class="nvx-btn btn-sec" onclick="likePost('${post.id}', this)">
                <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-thumbs-up"></i> ${isLiked ? 'Liked' : 'Like'} (${post.likes_count || 0})
            </button>
            <button class="nvx-btn btn-sec" onclick="commentOnPost('${post.id}')">
                <i class="fa-regular fa-comment"></i> Comment (${post.comments_count || 0})
            </button>
            <button class="nvx-btn btn-sec" onclick="sharePost('${post.id}')">
                <i class="fa-solid fa-share"></i> Share
            </button>
            <button class="nvx-btn btn-pri" onclick="viewPostDetails('${post.id}')">Read More</button>
        </div>
    `;
    return postElement;
}

// Post creation functions
window.showCreatePost = function() {
    if (!currentUser) {
        showNotification('Please login to create posts', 'error');
        login();
        return;
    }
    
    const feed = document.getElementById('feed');
    feed.scrollIntoView({ behavior: 'smooth' });
    
    if (!document.querySelector('.nvx-post-form')) {
        const postForm = document.createElement('div');
        postForm.className = 'nvx-post-form';
        postForm.innerHTML = `
            <h3 style="margin-bottom:15px"><i class="fa-solid fa-pen"></i> Create New Post</h3>
            <input type="text" id="postTitle" placeholder="Post Title" maxlength="100">
            <textarea id="postContent" placeholder="What's on your mind?" maxlength="1000"></textarea>
            <input type="text" id="postImage" placeholder="Image URL (optional)">
            <div style="display:flex; gap:10px; justify-content:flex-end">
                <button onclick="clearPostForm()" class="nvx-btn btn-sec">Clear</button>
                <button onclick="submitPost()" class="nvx-btn btn-pri">Post</button>
            </div>
        `;
        feed.prepend(postForm);
    }
    
    document.getElementById('postTitle').focus();
};

window.clearPostForm = function() {
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postImage').value = '';
};

function submitPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const image = document.getElementById('postImage').value.trim();
    
    if (!title || !content) {
        showNotification('Please fill in title and content', 'error');
        return;
    }
    
    try {
        const posts = JSON.parse(localStorage.getItem('newox-posts') || '[]');
        const newPost = {
            id: Date.now().toString(),
            title,
            content,
            image: image || null,
            author: currentUser.name || currentUser.email.split('@')[0],
            likes_count: 0,
            comments_count: 0,
            views: 0,
            likedBy: [],
            created_at: new Date().toISOString()
        };
        
        posts.unshift(newPost);
        localStorage.setItem('newox-posts', JSON.stringify(posts));
        
        showNotification('Post created successfully! +10 points', 'success');
        addUserPoints(10);
        clearPostForm();
        
        // Reload feed
        loadFeed(currentFeed);
        
    } catch (error) {
        console.error('Error creating post:', error);
        showNotification('Failed to create post', 'error');
    }
}

// Authentication (Simulated)
window.login = function() {
    // Simulate Google OAuth
    const fakeUser = {
        email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        name: `User${Math.floor(Math.random() * 1000)}`,
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
        id: Date.now().toString()
    };
    
    currentUser = fakeUser;
    updateUserUI();
    
    // Initialize user profile
    const users = JSON.parse(localStorage.getItem('newox-users') || '{}');
    if (!users[fakeUser.email]) {
        users[fakeUser.email] = {
            points: 100,
            created_at: new Date().toISOString()
        };
        localStorage.setItem('newox-users', JSON.stringify(users));
    }
    
    document.getElementById('user-section').style.display = 'block';
    document.getElementById('u-points').textContent = users[fakeUser.email].points;
    
    // Add daily login points
    const lastLogin = localStorage.getItem('newox-last-login-' + fakeUser.email);
    const today = new Date().toDateString();
    if (lastLogin !== today) {
        addUserPoints(5);
        localStorage.setItem('newox-last-login-' + fakeUser.email, today);
        showNotification('Daily login bonus! +5 points', 'success');
    }
    
    showNotification(`Welcome ${fakeUser.name}!`, 'success');
};

window.logout = function() {
    currentUser = null;
    updateUserUI();
    document.getElementById('user-section').style.display = 'none';
    showNotification('Logged out successfully', 'info');
};

// Check authentication status
function checkAuth() {
    // Check for stored user
    const storedUser = localStorage.getItem('newox-current-user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUserUI();
        document.getElementById('user-section').style.display = 'block';
        
        const users = JSON.parse(localStorage.getItem('newox-users') || '{}');
        document.getElementById('u-points').textContent = users[currentUser.email]?.points || 0;
    }
}

// Update UI based on auth status
function updateUserUI() {
    const authBtn = document.getElementById('auth-btn');
    const userImg = document.getElementById('u-img');
    
    if (currentUser) {
        authBtn.style.display = 'none';
        userImg.style.display = 'block';
        userImg.src = currentUser.avatar;
        userImg.alt = currentUser.name;
        
        // Store user in localStorage
        localStorage.setItem('newox-current-user', JSON.stringify(currentUser));
    } else {
        authBtn.style.display = 'block';
        userImg.style.display = 'none';
        localStorage.removeItem('newox-current-user');
    }
}

// Theme functionality
function loadThemeSelector() {
    const colors = [
        '#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#6366f1',
        '#14b8a6','#f97316','#d946ef','#84cc16','#0ea5e9','#f43f5e','#a855f7','#22c55e'
    ];
    
    const selector = document.getElementById('themeSelector');
    selector.innerHTML = '<option value="">Select Theme Color</option>';
    
    colors.forEach((color, index) => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = `Theme ${index + 1}`;
        option.style.backgroundColor = color;
        option.style.color = getContrastColor(color);
        selector.appendChild(option);
    });
    
    const savedTheme = localStorage.getItem('newox-theme');
    if (savedTheme) {
        document.documentElement.style.setProperty('--nvx-primary', savedTheme);
        selector.value = savedTheme;
    }
}

window.applyTheme = function(color) {
    if (!color) return;
    document.documentElement.style.setProperty('--nvx-primary', color);
    localStorage.setItem('newox-theme', color);
    showNotification('Theme applied', 'success');
};

window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('newox-theme-mode', newTheme);
    
    const icon = document.querySelector('.nvx-toggle-handle i');
    icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
};

window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('open');
    } else {
        sidebar.classList.toggle('closed');
    }
};

// Search posts
function searchPosts(query) {
    if (!query.trim()) {
        loadFeed('post');
        return;
    }
    
    try {
        const feed = document.getElementById('feed');
        feed.innerHTML = `
            <div class="nvx-loader">
                <div class="spinner"></div>
                <p>Searching for "${query}"...</p>
            </div>
        `;
        
        setTimeout(() => {
            const posts = JSON.parse(localStorage.getItem('newox-posts') || '[]');
            const filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(query.toLowerCase()) || 
                post.content.toLowerCase().includes(query.toLowerCase())
            );
            
            if (filteredPosts.length > 0) {
                renderPosts(filteredPosts);
            } else {
                feed.innerHTML = `
                    <div style="text-align:center; padding:50px; color:var(--nvx-text-sec)">
                        <i class="fa-regular fa-search" style="font-size:48px; margin-bottom:20px"></i>
                        <h3>No results found for "${query}"</h3>
                        <button onclick="loadFeed('post')" class="nvx-btn btn-pri" style="margin-top:20px">
                            <i class="fa-solid fa-home"></i> Back to Home
                        </button>
                    </div>
                `;
            }
        }, 500);
        
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Search failed', 'error');
    }
}

// Utility functions
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    } catch {
        return 'Recently';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getContrastColor(hexColor) {
    if (!hexColor || hexColor.length !== 7) return '#ffffff';
    try {
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#ffffff';
    } catch {
        return '#ffffff';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.nvx-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `nvx-notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update online count
function updateOnlineCount() {
    setInterval(() => {
        onlineUsers = Math.floor(Math.random() * 50) + 1;
        document.getElementById('onlineCount').textContent = onlineUsers;
    }, 30000);
}

// Post interactions
function likePost(postId, button) {
    if (!currentUser) {
        showNotification('Please login to like posts', 'error');
        return;
    }
    
    try {
        const posts = JSON.parse(localStorage.getItem('newox-posts') || '[]');
        const postIndex = posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) {
            showNotification('Post not found', 'error');
            return;
        }
        
        const post = posts[postIndex];
        
        // Check if already liked
        if (!post.likedBy) post.likedBy = [];
        
        const userIndex = post.likedBy.indexOf(currentUser.email);
        
        if (userIndex > -1) {
            // Unlike
            post.likedBy.splice(userIndex, 1);
            post.likes_count = Math.max(0, (post.likes_count || 1) - 1);
            button.innerHTML = '<i class="fa-regular fa-thumbs-up"></i> Like (' + post.likes_count + ')';
            showNotification('Post unliked', 'info');
        } else {
            // Like
            post.likedBy.push(currentUser.email);
            post.likes_count = (post.likes_count || 0) + 1;
            button.innerHTML = '<i class="fa-solid fa-thumbs-up"></i> Liked (' + post.likes_count + ')';
            button.style.color = 'var(--nvx-primary)';
            addUserPoints(5);
            showNotification('Post liked! +5 points', 'success');
        }
        
        // Update storage
        posts[postIndex] = post;
        localStorage.setItem('newox-posts', JSON.stringify(posts));
        
    } catch (error) {
        console.error('Error liking post:', error);
        showNotification('Failed to like post', 'error');
    }
}

function addUserPoints(points) {
    if (!currentUser) return;
    
    try {
        const users = JSON.parse(localStorage.getItem('newox-users') || '{}');
        if (!users[currentUser.email]) {
            users[currentUser.email] = { points: 0 };
        }
        
        users[currentUser.email].points = (users[currentUser.email].points || 0) + points;
        localStorage.setItem('newox-users', JSON.stringify(users));
        
        document.getElementById('u-points').textContent = users[currentUser.email].points;
            
    } catch (error) {
        console.error('Error adding points:', error);
    }
}

function commentOnPost(postId) {
    if (!currentUser) {
        showNotification('Please login to comment', 'error');
        return;
    }
    
    const comment = prompt('Enter your comment:');
    if (comment && comment.trim()) {
        try {
            const posts = JSON.parse(localStorage.getItem('newox-posts') || '[]');
            const postIndex = posts.findIndex(p => p.id === postId);
            
            if (postIndex > -1) {
                posts[postIndex].comments_count = (posts[postIndex].comments_count || 0) + 1;
                localStorage.setItem('newox-posts', JSON.stringify(posts));
                
                showNotification('Comment added! +2 points', 'success');
                addUserPoints(2);
                
                // Update UI
                loadFeed(currentFeed);
            }
            
        } catch (error) {
            console.error('Error adding comment:', error);
            showNotification('Failed to add comment', 'error');
        }
    }
}

function sharePost(postId) {
    const postUrl = `${window.location.origin}?post=${postId}`;
    
    if (navigator.share) {
        try {
            navigator.share({
                title: 'Check out this post on NEVOX',
                text: 'I found this interesting post on NEVOX Ecosystem',
                url: postUrl,
            }).then(() => {
                addUserPoints(3);
                showNotification('Shared! +3 points', 'success');
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                navigator.clipboard.writeText(postUrl).then(() => {
                    showNotification('Link copied to clipboard! +1 point', 'info');
                    addUserPoints(1);
                });
            }
        }
    } else {
        navigator.clipboard.writeText(postUrl).then(() => {
            showNotification('Link copied to clipboard! +1 point', 'info');
            addUserPoints(1);
        });
    }
}

function viewPostDetails(postId) {
    showNotification(`Viewing post details...`, 'info');
    addUserPoints(1);
}

// Profile functions
window.showProfile = function() {
    if (!currentUser) {
        showNotification('Please login to view profile', 'error');
        return;
    }
    
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileContent');
    
    const users = JSON.parse(localStorage.getItem('newox-users') || '{}');
    const userData = users[currentUser.email] || { points: 0 };
    
    content.innerHTML = `
        <div style="text-align:center; margin-bottom:30px">
            <img src="${currentUser.avatar}" 
                 style="width:100px; height:100px; border-radius:50%; border:3px solid var(--nvx-primary); margin-bottom:15px">
            <h3>${currentUser.name}</h3>
            <p style="color:var(--nvx-text-sec)">${currentUser.email}</p>
        </div>
        
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:15px; margin-bottom:30px">
            <div style="background:var(--nvx-bg-sec); padding:15px; border-radius:var(--nvx-radius); text-align:center">
                <div style="font-size:24px; font-weight:bold; color:var(--nvx-primary)">${userData.points || 0}</div>
                <div style="font-size:12px; color:var(--nvx-text-sec)">Total Points</div>
            </div>
            <div style="background:var(--nvx-bg-sec); padding:15px; border-radius:var(--nvx-radius); text-align:center">
                <div style="font-size:24px; font-weight:bold; color:var(--nvx-success)">${new Date().toLocaleDateString()}</div>
                <div style="font-size:12px; color:var(--nvx-text-sec)">Member Since</div>
            </div>
        </div>
        
        <div style="margin-top:20px; border-top:1px solid var(--nvx-border); padding-top:20px">
            <h4 style="margin-bottom:10px">Account Settings</h4>
            <div style="display:flex; flex-direction:column; gap:10px">
                <button onclick="showSettings()" class="nvx-btn btn-sec" style="justify-content:flex-start">
                    <i class="fa-solid fa-gear"></i> General Settings
                </button>
                <button onclick="showNotification('Privacy settings coming soon', 'info')" class="nvx-btn btn-sec" style="justify-content:flex-start">
                    <i class="fa-solid fa-shield"></i> Privacy Settings
                </button>
                <button onclick="showNotification('Notification settings coming soon', 'info')" class="nvx-btn btn-sec" style="justify-content:flex-start">
                    <i class="fa-solid fa-bell"></i> Notifications
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
};

window.closeProfile = function() {
    document.getElementById('profileModal').style.display = 'none';
};

window.showSettings = function() {
    const settings = `
        <h3><i class="fa-solid fa-gear"></i> Settings</h3>
        <div style="margin-top:20px">
            <div style="margin-bottom:15px">
                <label style="display:block; margin-bottom:5px; font-weight:500">Language</label>
                <select style="width:100%; padding:10px; border-radius:var(--nvx-radius); background:var(--nvx-bg-sec); border:1px solid var(--nvx-border); color:var(--nvx-text)">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                </select>
            </div>
            <div style="margin-bottom:15px">
                <label style="display:block; margin-bottom:5px; font-weight:500">Theme Mode</label>
                <select id="themeMode" style="width:100%; padding:10px; border-radius:var(--nvx-radius); background:var(--nvx-bg-sec); border:1px solid var(--nvx-border); color:var(--nvx-text)">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                </select>
            </div>
            <button onclick="saveSettings()" class="nvx-btn btn-pri" style="width:100%">Save Settings</button>
        </div>
    `;
    
    document.getElementById('profileContent').innerHTML = settings;
};

function saveSettings() {
    showNotification('Settings saved successfully', 'success');
    closeProfile();
}

// AI Assistant
window.openAIAssistant = function() {
    document.getElementById('aiModal').style.display = 'flex';
    document.getElementById('aiInput').focus();
};

window.closeAIAssistant = function() {
    document.getElementById('aiModal').style.display = 'none';
};

window.sendAIMessage = function() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addAIMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    const chat = document.getElementById('ai-chat');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div style="display:flex;align-items:center;gap:5px;color:var(--nvx-text-sec)">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;
    
    // Simulate AI response
    setTimeout(() => {
        document.getElementById('typing-indicator')?.remove();
        
        const responses = [
            "I'm NEVOX AI Assistant! I can help you with content discovery, user engagement tips, and platform features. What would you like to know?",
            "That's a great question! On NEVOX, you can earn points by creating posts, liking content, and engaging with the community. Points unlock premium features!",
            "I recommend checking the trending section for popular content. You can also use the search feature to find specific topics you're interested in.",
            "For better engagement, try posting at peak hours (10 AM - 2 PM), using relevant hashtags, and including high-quality images with your posts.",
            "The NEVOX ecosystem includes AI tools, media galleries, and analytics. You can access these features from the sidebar menu.",
            "If you're having trouble with any feature, make sure you're logged in first. Some features require authentication to work properly.",
            "You can customize your NEVOX experience by changing the theme color from the sidebar. Try different colors to find your favorite!"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addAIMessage(randomResponse, 'bot');
    }, 1500);
};

function addAIMessage(message, sender) {
    const chat = document.getElementById('ai-chat');
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        background: ${sender === 'user' ? 'var(--nvx-primary)' : 'var(--nvx-bg-sec)'};
        color: ${sender === 'user' ? 'white' : 'var(--nvx-text)'};
        padding: 10px 15px;
        border-radius: var(--nvx-radius);
        max-width: 80%;
        align-self: ${sender === 'user' ? 'flex-end' : 'flex-start'};
        margin-left: ${sender === 'user' ? 'auto' : '0'};
        margin-right: ${sender === 'user' ? '0' : 'auto'};
    `;
    messageDiv.textContent = message;
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
}

// Other features
function openMediaPlayer() {
    showNotification('Audio player coming soon!', 'info');
}

function openMediaGallery() {
    showNotification('Media gallery coming soon!', 'info');
}

function openAITools() {
    showNotification('AI Tools dashboard coming soon!', 'info');
}

function openAnalytics() {
    showNotification('Analytics dashboard coming soon!', 'info');
}

// Load saved theme mode
const savedThemeMode = localStorage.getItem('newox-theme-mode');
if (savedThemeMode) {
    document.documentElement.setAttribute('data-theme', savedThemeMode);
    const icon = document.querySelector('.nvx-toggle-handle i');
    if (icon) {
        icon.className = savedThemeMode === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
}
