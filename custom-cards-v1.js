// Custom Cards v1 - 라벨별 포스트 카드 생성기
// 사용법: {customCards-v1} $label1=(라벨명) $count1=(개수)

function initCustomCardsV1(container, config) {
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
                count: parseInt(params[`count${i}`]) || 3
            });
        }
    }
    
    // 컨테이너 스타일 설정
    container.innerHTML = `
        <div class="custom-cards-v1-container">
            <div class="loading-message">포스트를 불러오는 중...</div>
        </div>
    `;
    
    // CSS 추가
    if (!document.getElementById('custom-cards-v1-css')) {
        const style = document.createElement('style');
        style.id = 'custom-cards-v1-css';
        style.textContent = `
            .custom-cards-v1-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                padding: 15px;
                max-width: 1000px;
                margin: 0 auto;
                background: #2c3e50;
                border-radius: 20px;
                box-shadow: 8px 8px 16px rgba(34, 47, 62, 0.8),
                           -8px -8px 16px rgba(52, 73, 94, 0.3);
            }
            
            .custom-card-v1 {
                background: #34495e;
                border-radius: 15px;
                box-shadow: inset 4px 4px 8px rgba(34, 47, 62, 0.5),
                           inset -4px -4px 8px rgba(52, 73, 94, 0.3);
                overflow: hidden;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
            }
            
            .custom-card-v1:hover {
                transform: translateY(-3px);
                box-shadow: 4px 4px 8px rgba(34, 47, 62, 0.6),
                           -4px -4px 8px rgba(52, 73, 94, 0.4);
            }
            
            .custom-card-v1-image {
                width: 100%;
                height: 180px;
                overflow: hidden;
                border-radius: 10px;
                margin: 10px;
                width: calc(100% - 20px);
                box-shadow: inset 2px 2px 4px rgba(34, 47, 62, 0.4),
                           inset -2px -2px 4px rgba(52, 73, 94, 0.2);
            }
            
            .custom-card-v1-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 10px;
                transition: transform 0.3s ease;
            }
            
            .custom-card-v1:hover .custom-card-v1-image img {
                transform: scale(1.05);
            }
            
            .custom-card-v1-content {
                padding: 15px;
                background: #34495e;
            }
            
            .custom-card-v1-label {
                background: #2c3e50;
                color: #bdc3c7;
                padding: 4px 10px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: 500;
                display: inline-block;
                margin-bottom: 10px;
                box-shadow: 2px 2px 4px rgba(34, 47, 62, 0.4),
                           -2px -2px 4px rgba(52, 73, 94, 0.3);
            }
            
            .custom-card-v1-title {
                font-size: 16px;
                font-weight: 600;
                color: #ecf0f1;
                margin: 0 0 10px 0;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            .custom-card-v1-author {
                background: #2c3e50;
                color: #ecf0f1;
                padding: 6px 12px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: 500;
                display: inline-block;
                box-shadow: inset 2px 2px 4px rgba(34, 47, 62, 0.3),
                           inset -2px -2px 4px rgba(52, 73, 94, 0.2);
            }
            
            .loading-message {
                text-align: center;
                color: #bdc3c7;
                font-size: 14px;
                padding: 20px;
            }
            
            @media (max-width: 768px) {
                .custom-cards-v1-container {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    padding: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 각 라벨별로 포스트 가져오기
    const allPosts = [];
    let completedRequests = 0;
    
    if (labels.length === 0) {
        container.querySelector('.custom-cards-v1-container').innerHTML = 
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
        const containerDiv = container.querySelector('.custom-cards-v1-container');
        
        if (posts.length === 0) {
            containerDiv.innerHTML = '<div class="loading-message">포스트를 찾을 수 없습니다.</div>';
            return;
        }
        
        const cardsHTML = posts.map(post => {
            const title = post.title.$t;
            const url = post.link.find(link => link.rel === 'alternate').href;
            const image = post.media$thumbnail ? post.media$thumbnail.url : 'https://via.placeholder.com/300x180/e0e5ec/636e72?text=No+Image';
            const author = post.author[0].name.$t;
            const labelName = post.labelName;
            
            return `
                <div class="custom-card-v1" onclick="window.location.href='${url}'">
                    <div class="custom-card-v1-image">
                        <img src="${image}" alt="${title}" loading="lazy">
                    </div>
                    <div class="custom-card-v1-content">
                        <div class="custom-card-v1-label">#${labelName}</div>
                        <h3 class="custom-card-v1-title">${title}</h3>
                        <div class="custom-card-v1-author">${author}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        containerDiv.innerHTML = cardsHTML;
    }
}

// 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    // {customCards-v1} 패턴 찾기
    const scriptTags = document.querySelectorAll('script');
    scriptTags.forEach(script => {
        const content = script.textContent || script.innerText;
        if (content.includes('{customCards-v1}')) {
            const container = script.parentNode;
            const configMatch = content.match(/\{customCards-v1\}([\s\S]*?)(?=<\/script>|$)/);
            if (configMatch) {
                initCustomCardsV1(container, configMatch[1]);
            }
        }
    });
}); 