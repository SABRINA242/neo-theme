// Custom Cards v2 - 라벨별 포스트 세로형 카드 생성기
// 사용법: {customCards-v2} $label1=(라벨명) $count1=(개수)

function initCustomCardsV2(container, config) {
    // 파라미터 파싱
    const params = {};
    const lines = config.split('\n');
    
    lines.forEach(line => {
        const match = line.match(/\$(\w+)=\(([^)]+)\)/);
        if (match) {
            params[match[1]] = match[2];
        }
    });
    
    // 라벨 설정 추출
    const labels = [];
    for (let i = 1; i <= 10; i++) {
        if (params[`label${i}`] && params[`count${i}`]) {
            labels.push({
                name: params[`label${i}`],
                count: parseInt(params[`count${i}`]) || 4
            });
        }
    }
    
    // 컨테이너 스타일 설정
    container.innerHTML = `
        <div class="custom-cards-v2-container">
            <div class="loading-message">포스트를 불러오는 중...</div>
        </div>
    `;
    
    // CSS 추가
    if (!document.getElementById('custom-cards-v2-css')) {
        const style = document.createElement('style');
        style.id = 'custom-cards-v2-css';
        style.textContent = `
            .custom-cards-v2-container {
                max-width: 1000px;
                margin: 0 auto;
                padding: 20px;
                background: #1a1a1a;
                border-radius: 20px;
                box-shadow: 8px 8px 16px rgba(10, 10, 10, 0.8),
                           -8px -8px 16px rgba(40, 40, 40, 0.3);
            }
            
            .custom-card-v2 {
                display: flex;
                align-items: center;
                background: #2d2d2d;
                border-radius: 15px;
                box-shadow: inset 4px 4px 8px rgba(10, 10, 10, 0.5),
                           inset -4px -4px 8px rgba(40, 40, 40, 0.3);
                margin-bottom: 15px;
                overflow: hidden;
                transition: all 0.3s ease;
                cursor: pointer;
                padding: 15px;
                gap: 15px;
            }
            
            .custom-card-v2:hover {
                transform: translateX(5px);
                box-shadow: 4px 4px 8px rgba(10, 10, 10, 0.6),
                           -4px -4px 8px rgba(40, 40, 40, 0.4);
            }
            
            .custom-card-v2:last-child {
                margin-bottom: 0;
            }
            
            .custom-card-v2-image {
                width: 120px;
                height: 80px;
                border-radius: 10px;
                overflow: hidden;
                flex-shrink: 0;
                box-shadow: inset 2px 2px 4px rgba(163, 177, 198, 0.3),
                           inset -2px -2px 4px rgba(245, 240, 255, 0.3);
            }
            
            .custom-card-v2-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 10px;
                transition: transform 0.3s ease;
            }
            
            .custom-card-v2:hover .custom-card-v2-image img {
                transform: scale(1.1);
            }
            
            .custom-card-v2-content {
                flex: 1;
                min-width: 0;
            }
            
            .custom-card-v2-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 8px;
            }
            
            .custom-card-v2-label {
                background: #1a1a1a;
                color: #b0b0b0;
                padding: 3px 8px;
                border-radius: 8px;
                font-size: 10px;
                font-weight: 500;
                box-shadow: 2px 2px 4px rgba(10, 10, 10, 0.4),
                           -2px -2px 4px rgba(40, 40, 40, 0.3);
            }
            
            .custom-card-v2-author {
                background: #1a1a1a;
                color: #e0e0e0;
                padding: 3px 8px;
                border-radius: 8px;
                font-size: 10px;
                font-weight: 500;
                box-shadow: inset 2px 2px 4px rgba(10, 10, 10, 0.3),
                           inset -2px -2px 4px rgba(40, 40, 40, 0.2);
            }
            
            .custom-card-v2-title {
                font-size: 15px;
                font-weight: 600;
                color: #f0f0f0;
                margin: 0;
                line-height: 1.3;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            .loading-message {
                text-align: center;
                color: #b0b0b0;
                font-size: 14px;
                padding: 20px;
            }
            
            @media (max-width: 768px) {
                .custom-card-v2 {
                    flex-direction: column;
                    text-align: center;
                    gap: 10px;
                }
                
                .custom-card-v2-image {
                    width: 100%;
                    height: 120px;
                }
                
                .custom-card-v2-header {
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 각 라벨별로 포스트 가져오기
    const allPosts = [];
    let completedRequests = 0;
    
    if (labels.length === 0) {
        container.querySelector('.custom-cards-v2-container').innerHTML = 
            '<div class="loading-message">설정된 라벨이 없습니다.</div>';
        return;
    }
    
    labels.forEach(labelConfig => {
        fetch(`/feeds/posts/default/-/${encodeURIComponent(labelConfig.name)}?alt=json&max-results=${labelConfig.count}`)
            .then(response => response.json())
            .then(data => {
                if (data.feed && data.feed.entry) {
                    allPosts.push(...data.feed.entry.map(entry => ({
                        ...entry,
                        labelName: labelConfig.name
                    })));
                }
                
                completedRequests++;
                if (completedRequests === labels.length) {
                    renderCards(allPosts);
                }
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                completedRequests++;
                if (completedRequests === labels.length) {
                    renderCards(allPosts);
                }
            });
    });
    
    function renderCards(posts) {
        const containerDiv = container.querySelector('.custom-cards-v2-container');
        
        if (posts.length === 0) {
            containerDiv.innerHTML = '<div class="loading-message">포스트를 찾을 수 없습니다.</div>';
            return;
        }
        
        const cardsHTML = posts.map(post => {
            const title = post.title.$t;
            const url = post.link.find(link => link.rel === 'alternate').href;
            const image = post.media$thumbnail ? post.media$thumbnail.url : 'https://via.placeholder.com/120x80/e0e5ec/636e72?text=No+Image';
            const author = post.author[0].name.$t;
            const labelName = post.labelName;
            
            return `
                <div class="custom-card-v2" onclick="window.location.href='${url}'">
                    <div class="custom-card-v2-image">
                        <img src="${image}" alt="${title}" loading="lazy">
                    </div>
                    <div class="custom-card-v2-content">
                        <div class="custom-card-v2-header">
                            <div class="custom-card-v2-label">#${labelName}</div>
                            <div class="custom-card-v2-author">${author}</div>
                        </div>
                        <h3 class="custom-card-v2-title">${title}</h3>
                    </div>
                </div>
            `;
        }).join('');
        
        containerDiv.innerHTML = cardsHTML;
    }
}

// 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 모든 위젯 컨테이너에서 {customCards-v2} 패턴 찾기
    document.querySelectorAll('.widget-content').forEach(container => {
        const content = container.textContent || container.innerText;
        if (content.includes('{customCards-v2}')) {
            const configMatch = content.match(/\{customCards-v2\}([\s\S]*)/);
            if (configMatch) {
                initCustomCardsV2(container, configMatch[1]);
            }
        }
    });
}); 