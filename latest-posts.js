// Latest Posts - 최신 포스트 커스텀 카드 위젯
// 사용법: {latestPosts} $count=(개수)

function initLatestPosts(container, config) {
    // 파라미터 파싱
    const params = {};
    const lines = config.split('\n');
    
    lines.forEach(line => {
        const match = line.match(/\$(\w+)=\(([^)]+)\)/);
        if (match) {
            params[match[1]] = match[2];
        }
    });
    
    // 설정
    const count = parseInt(params.count) || 6;
    
    // 컨테이너 스타일 설정
    container.innerHTML = `
        <div class="latest-posts-container">
            <div class="loading-message">최신 포스트를 불러오는 중...</div>
        </div>
    `;
    
    // CSS 추가
    if (!document.getElementById('latest-posts-css')) {
        const style = document.createElement('style');
        style.id = 'latest-posts-css';
        style.textContent = `
            .latest-posts-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 25px;
                padding: 15px;
                max-width: 1000px;
                margin: 0 auto;
                background: #e0e5ec;
                border-radius: 20px;
                box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.6),
                           -8px -8px 16px rgba(245, 240, 255, 0.6);
            }

            .latest-post-card {
                background: #ffffff;
                border-radius: 20px;
                box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.6),
                           -8px -8px 16px rgba(245, 240, 255, 0.6);
                overflow: hidden;
                transition: all 0.3s ease;
                border: none;
                position: relative;
                cursor: pointer;
            }

            .latest-post-card:hover {
                transform: translateY(-3px);
                box-shadow: inset 8px 8px 16px rgba(163, 177, 198, 0.3),
                           inset -8px -8px 16px rgba(245, 240, 255, 0.3),
                           12px 12px 20px rgba(163, 177, 198, 0.4),
                           -12px -12px 20px rgba(245, 240, 255, 0.4);
            }

            .latest-post-thumbnail {
                width: 100%;
                height: 200px;
                overflow: hidden;
                border-radius: 15px;
                margin: 15px;
                margin-bottom: 0;
                width: calc(100% - 30px);
                box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.4),
                           inset -4px -4px 8px rgba(245, 240, 255, 0.4);
            }

            .latest-post-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
                border-radius: 15px;
            }

            .latest-post-card:hover .latest-post-thumbnail img {
                transform: scale(1.02);
            }

            .latest-card-content {
                padding: 20px;
                background: #ffffff;
            }

            .latest-post-meta-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                font-size: 12px;
                color: #666;
            }

            .latest-post-labels {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .latest-label-tag {
                background: #e0e5ec;
                color: #636e72;
                padding: 4px 10px;
                border-radius: 12px;
                text-decoration: none;
                font-size: 11px;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 3px 3px 6px rgba(163, 177, 198, 0.4),
                           -3px -3px 6px rgba(245, 240, 255, 0.4);
            }

            .latest-label-tag:hover {
                box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.4),
                           inset -3px -3px 6px rgba(245, 240, 255, 0.4);
                transform: translateY(1px);
            }

            .latest-post-title {
                margin: 0 0 15px 0;
                font-size: 18px;
                line-height: 1.4;
                color: #2d3436;
                font-weight: 600;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .latest-card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 15px;
                border-top: none;
                margin-top: 15px;
            }

            .latest-author-info {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                background: #e0e5ec;
                border-radius: 12px;
                box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.3),
                           inset -3px -3px 6px rgba(245, 240, 255, 0.3);
            }

            .latest-post-author {
                font-weight: 500;
                color: #2d3436;
                font-size: 14px;
            }

            .loading-message {
                text-align: center;
                color: #636e72;
                font-size: 14px;
                padding: 20px;
                grid-column: 1 / -1;
            }

            /* 반응형 디자인 */
            @media (max-width: 768px) {
                .latest-posts-container {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    padding: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 최신 포스트 가져오기
    fetch(`/feeds/posts/default?alt=json&max-results=${count}`)
        .then(response => response.json())
        .then(data => {
            if (data.feed && data.feed.entry) {
                renderCards(data.feed.entry);
            } else {
                container.querySelector('.latest-posts-container').innerHTML = 
                    '<div class="loading-message">포스트를 찾을 수 없습니다.</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            container.querySelector('.latest-posts-container').innerHTML = 
                '<div class="loading-message">포스트를 불러올 수 없습니다.</div>';
        });
    
    function renderCards(posts) {
        const containerDiv = container.querySelector('.latest-posts-container');
        
        const cardsHTML = posts.map(post => {
            const title = post.title.$t;
            const url = post.link.find(link => link.rel === 'alternate').href;
            const image = post.media$thumbnail ? post.media$thumbnail.url : 'https://via.placeholder.com/300x200/e0e5ec/636e72?text=No+Image';
            const author = post.author[0].name.$t;
            const labels = post.category || [];
            
            const labelsHTML = labels.length > 0 ? 
                `<div class="latest-post-labels">
                    <a class="latest-label-tag" href="/search/label/${encodeURIComponent(labels[0].term)}">${labels[0].term}</a>
                </div>` : '';
            
            return `
                <article class="latest-post-card" onclick="window.location.href='${url}'">
                    <div class="card-header">
                        <div class="latest-post-thumbnail">
                            <img src="${image}" alt="${title}" loading="lazy">
                        </div>
                    </div>
                    <div class="latest-card-content">
                        <div class="latest-post-meta-info">
                            ${labelsHTML}
                        </div>
                        <h2 class="latest-post-title">${title}</h2>
                        <div class="latest-card-footer">
                            <div class="latest-author-info">
                                <span class="latest-post-author">${author}</span>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
        
        containerDiv.innerHTML = cardsHTML;
    }
}

// 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    // {latestPosts} 패턴 찾기
    const scriptTags = document.querySelectorAll('script');
    scriptTags.forEach(script => {
        const content = script.textContent || script.innerText;
        if (content.includes('{latestPosts}')) {
            const container = script.parentNode;
            const configMatch = content.match(/\{latestPosts\}([\s\S]*?)(?=<\/script>|$)/);
            if (configMatch) {
                initLatestPosts(container, configMatch[1]);
            }
        }
    });
}); 