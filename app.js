document.addEventListener('DOMContentLoaded', async () => {
    const menuContainer = document.getElementById('menu');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');

    try {
        // Load videos.json
        const response = await fetch('videos.json');
        if (!response.ok) throw new Error('Errore nel caricamento di videos.json');
        
        const videoData = await response.json();

        // Clear loading message
        menuContainer.innerHTML = '';

        // Build hierarchical menu: Year > Dance Style > Lessons
        Object.entries(videoData).forEach(([yearKey, danceStyles]) => {
            // Format year name (e.g., "primo_anno" -> "Primo anno")
            const yearName = yearKey
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Create year section container
            const yearDiv = document.createElement('div');
            yearDiv.className = 'menu-section';

            // Create year title (collapsible)
            const yearTitleDiv = document.createElement('div');
            yearTitleDiv.className = 'menu-section-title expanded';
            yearTitleDiv.textContent = yearName;
            
            // Create year items container
            const yearItemsDiv = document.createElement('div');
            yearItemsDiv.className = 'menu-items';

            // Toggle year collapse/expand
            yearTitleDiv.addEventListener('click', () => {
                yearTitleDiv.classList.toggle('collapsed');
                yearTitleDiv.classList.toggle('expanded');
                yearItemsDiv.classList.toggle('collapsed');
            });

            // Build dance styles under each year
            Object.entries(danceStyles).forEach(([styleKey, lessons]) => {
                // Format style name (e.g., "salsa" -> "Salsa")
                const styleName = styleKey.charAt(0).toUpperCase() + styleKey.slice(1);

                // Create style subsection
                const styleDiv = document.createElement('div');
                styleDiv.className = 'menu-subsection';

                // Create style title (collapsible)
                const styleTitleDiv = document.createElement('div');
                styleTitleDiv.className = 'menu-subsection-title expanded';
                styleTitleDiv.textContent = styleName;
                
                // Create style items container
                const styleItemsDiv = document.createElement('div');
                styleItemsDiv.className = 'menu-subitems';

                // Toggle style collapse/expand
                styleTitleDiv.addEventListener('click', () => {
                    styleTitleDiv.classList.toggle('collapsed');
                    styleTitleDiv.classList.toggle('expanded');
                    styleItemsDiv.classList.toggle('collapsed');
                });

                // Create lesson items
                lessons.forEach((lesson, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'menu-item';
                    itemDiv.textContent = lesson.nome;

                    itemDiv.addEventListener('click', () => {
                        // Update active state
                        document.querySelectorAll('.menu-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        itemDiv.classList.add('active');

                        // Update video player
                        // Construct video path: use relative path instead of absolute
                        const videoPath = `videos${lesson.url}.mp4`;
                        videoPlayer.src = videoPath;
                        
                        videoTitle.textContent = lesson.nome;
                        videoDescription.textContent = `${yearName} - ${styleName} - ${lesson.nome}`;

                        // Try to play
                        videoPlayer.play().catch(err => {
                            console.warn('Errore nel riprodurre il video:', err);
                        });
                    });

                    styleItemsDiv.appendChild(itemDiv);
                });

                styleDiv.appendChild(styleTitleDiv);
                styleDiv.appendChild(styleItemsDiv);
                yearItemsDiv.appendChild(styleDiv);
            });

            yearDiv.appendChild(yearTitleDiv);
            yearDiv.appendChild(yearItemsDiv);
            menuContainer.appendChild(yearDiv);
        });

    } catch (error) {
        menuContainer.innerHTML = `<p class="loading" style="color: #e74c3c;">Errore: ${error.message}</p>`;
        console.error('Errore:', error);
    }
});

