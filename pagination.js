document.addEventListener('DOMContentLoaded', () => {
    const projectItemsContainer = document.querySelector('#projects-grid');
    if (!projectItemsContainer) {
        console.error('Project items container not found!');
        return;
    }
    const allProjectItems = Array.from(projectItemsContainer.querySelectorAll('.project-item'));
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const paginationButtonsContainer = document.getElementById('project-pagination-buttons');

    if (!prevButton || !nextButton || !paginationButtonsContainer) {
        console.error('Pagination buttons or their container not found!');
        return;
    }

    const itemsPerPage = 4;
    let currentPage = 0;
    let isAnimating = false; // Prevent rapid clicking during animation
    const totalProjects = allProjectItems.length;
    const totalPages = Math.ceil(totalProjects / itemsPerPage);

    function showPage(page, animated = false) {
        if (animated) {
            isAnimating = true;

            // Add loading state to buttons with smooth transition
            prevButton.style.transition = 'all 0.3s ease';
            nextButton.style.transition = 'all 0.3s ease';
            prevButton.style.opacity = '0.5';
            nextButton.style.opacity = '0.5';
            prevButton.style.transform = 'scale(0.95)';
            nextButton.style.transform = 'scale(0.95)';

            // Enhanced fade-out with slide effect
            projectItemsContainer.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            projectItemsContainer.style.opacity = '0';
            projectItemsContainer.style.transform = 'translateY(30px) scale(0.98)';
            projectItemsContainer.style.filter = 'blur(2px)';

            // Wait for fade-out to complete, then update content and fade-in
            setTimeout(() => {
                updateProjectVisibility(page);

                // Reset transform for fade-in
                projectItemsContainer.style.transform = 'translateY(-20px) scale(1.02)';

                // Trigger enhanced fade-in animation
                setTimeout(() => {
                    projectItemsContainer.style.opacity = '1';
                    projectItemsContainer.style.transform = 'translateY(0) scale(1)';
                    projectItemsContainer.style.filter = 'blur(0px)';

                    // Animation complete - restore button states with bounce
                    setTimeout(() => {
                        isAnimating = false;
                        prevButton.style.opacity = '';
                        nextButton.style.opacity = '';
                        prevButton.style.transform = '';
                        nextButton.style.transform = '';

                        // Remove transition to prevent interference with hover effects
                        setTimeout(() => {
                            projectItemsContainer.style.transition = '';
                            prevButton.style.transition = '';
                            nextButton.style.transition = '';
                        }, 100);
                    }, 400);
                }, 50); // Small delay to ensure DOM update
            }, 400); // Match CSS transition duration
        } else {
            // No animation for initial load
            updateProjectVisibility(page);
        }
    }

    function updateProjectVisibility(page) {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        allProjectItems.forEach((item, index) => {
            if (index >= startIndex && index < endIndex) {
                item.style.display = 'block';

                // Enhanced staggered animation for newly visible items
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px) scale(0.9)';
                item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

                const delay = (index - startIndex) * 150; // 150ms stagger between items
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';

                    // Add AOS animation if present
                    if (item.hasAttribute('data-aos')) {
                        item.classList.remove('aos-animate');
                        setTimeout(() => {
                            item.classList.add('aos-animate');
                        }, 100);
                    }

                    // Remove transition after animation completes
                    setTimeout(() => {
                        item.style.transition = '';
                    }, 500);
                }, delay + 200); // Base delay + stagger
            } else {
                item.style.display = 'none';
                item.style.opacity = '';
                item.style.transform = '';
                item.style.transition = '';
            }
        });
    }

    function updateButtons() {
        // Only show buttons if there are more than 4 projects (more than 1 page)
        if (totalProjects <= 4) {
            paginationButtonsContainer.classList.remove('visible');
            return;
        }

        // Show the pagination container
        paginationButtonsContainer.classList.add('visible');

        // Ensure buttons have the correct base classes
        prevButton.classList.add('btn-secondary');
        nextButton.classList.add('btn-secondary');

        // Update Previous button state
        if (currentPage === 0) {
            prevButton.disabled = true;
            prevButton.classList.add('btn-disabled');
        } else {
            prevButton.disabled = false;
            prevButton.classList.remove('btn-disabled');
        }

        // Update Next button state
        if (currentPage === totalPages - 1) {
            nextButton.disabled = true;
            nextButton.classList.add('btn-disabled');
        } else {
            nextButton.disabled = false;
            nextButton.classList.remove('btn-disabled');
        }
    }

    prevButton.addEventListener('click', () => {
        if (!isAnimating && currentPage > 0) {
            currentPage--;
            showPage(currentPage, true); // Enable animation
            updateButtons();
        }
    });

    nextButton.addEventListener('click', () => {
        if (!isAnimating && currentPage < totalPages - 1) {
            currentPage++;
            showPage(currentPage, true); // Enable animation
            updateButtons();
        }
    });

    // Initialize pagination on page load
    if (totalProjects > 0) {
        updateButtons(); // Update button states and visibility first
        showPage(currentPage); // Then show the appropriate projects
    } else {
        // Hide pagination if no projects
        paginationButtonsContainer.classList.remove('visible');
    }
});
