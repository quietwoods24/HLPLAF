document.addEventListener('DOMContentLoaded', loadPosts);

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    try {
        const res = await fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
        });
        
        if (res.ok) {
            alert('User created');
            e.target.reset();
        } else {
            const data = await res.json();
            alert('Error: ' + data.error);
        }
    } catch (err) {
        console.error(err);
    }
});

document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('postUserId').value;
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;

    try {
        const res = await fetch('/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, title, content })
        });
        
        if (res.ok) {
            e.target.reset();
            loadPosts();
        } else {
            alert('Error: please check if this user ID exists');
        }
    } catch (err) {
        console.error(err);
    }
});

document.getElementById('friendForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('friendCurrentUserId').value;
    const friendId = document.getElementById('friendId').value;

    try {
        const res = await fetch('/friends', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, friendId })
        });
        
        if (res.ok) {
            alert('Friend added successfully');
            e.target.reset();
        } else {
            const data = await res.json();
            alert('Error: ' + data.error);
        }
    } catch (err) {
        console.error(err);
    }
});

async function loadPosts() {
    const searchQuery = document.getElementById('searchInput').value;
    let url = '/posts';
    
    if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
    }

    try {
        const res = await fetch(url);
        const posts = await res.json();
        const post_container = document.getElementById('post-container');
        
        post_container.innerHTML = '';
        
        if (posts.length === 0) {
            post_container.innerHTML = '<p>Nothing found</p>';
            return;
        }

        posts.forEach(post => {
            let commentsHtml = '';
            if (post.Comments && post.Comments.length > 0) {
                post.Comments.forEach(comment => {
                    commentsHtml += `<div class="comment">${comment.text}</div>`;
                });
            }

            const likesCount = post.Likes ? post.Likes.length : 0;
            const authorId = post.User ? post.User.id : post.userId;

            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h4>${post.title}</h4>
                <p><small>Author ID: ${authorId}</small></p>
                <p style="margin-top: 10px;">${post.content}</p>
                
                <div style="margin-top: 12px; margin-bottom: 12px; display: flex; gap: 10px;">
                    <button onclick="toggleLike(${post.id})" style="background-color: #646e85;">Like (${likesCount})</button>
                    <button onclick="addFriendFromPostCont(${authorId})" style="background-color: #9c94c0;">Add Friend</button>
                </div>
                
                <div class="comments-section">
                    <strong>Comments:</strong>
                    ${commentsHtml}
                    <div class="add-comment-form">
                        <input type="text" id="commentText-${post.id}" placeholder="Your comment">
                        <button onclick="addComment(${post.id})">Send</button>
                    </div>
                </div>
            `;
            post_container.appendChild(postElement);
        });
    } catch (err) {
        console.error('Error loading posts:', err);
    }
}

async function toggleLike(postId) {
    const userId = 1;
    
    try {
        const res = await fetch('/likes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, postId })
        });
        
        if (res.ok) {
            loadPosts();
        } else {
            alert('Error updating like');
        }
    } catch (err) {
        console.error(err);
    }
}

async function addFriendFromPostCont(authorId) {
    const userId = 1;
    
    if (userId === authorId) {
        return alert('You cannot add yourself as a friend');
    }

    try {
        const res = await fetch('/friends', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, friendId: authorId })
        });
        
        if (res.ok) {
            alert('Friend added successfully!');
        } else {
            const data = await res.json();
            alert('Error: ' + data.error);
        }
    } catch (err) {
        console.error(err);
    }
}

async function addComment(postId) {
    const textInput = document.getElementById(`commentText-${postId}`);
    const text = textInput.value;
    
    const userId = 1; 

    if (!text) {
        return alert('Enter your comment');
    }

    try {
        const res = await fetch('/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, postId, userId })
        });
        
        if (res.ok) {
            loadPosts();
        } else {
            alert('Error adding a comment');
        }
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('loadLogsBtn').addEventListener('click', async () => {
    try {
        const res = await fetch('/admin/logs');
        const data = await res.json();
        
        const logsContainer = document.getElementById('logsContainer');
        const logsOutput = document.getElementById('logsOutput');
        
        logsOutput.textContent = JSON.stringify(data, null, 2);
        logsContainer.classList.remove('hidden');
    } catch (err) {
        console.error('Error loading logs:', err);
    }
});