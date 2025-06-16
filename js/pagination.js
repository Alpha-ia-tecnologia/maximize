/**
 * SAG - Sistema de Avaliação da Gestão
 * Utility for table pagination
 */

/**
 * Creates pagination controls for a table
 * @param {Object} options - Configuration options
 * @param {Array} options.data - The full data array
 * @param {number} options.itemsPerPage - Number of items per page (default: 10)
 * @param {function} options.renderItemCallback - Function to render a single item
 * @param {string} options.containerSelector - Selector for the container where items will be rendered
 * @param {string} options.paginationContainerSelector - Selector for pagination buttons container
 * @param {function} options.emptyCallback - Function to call when there are no items (optional)
 * @param {Object} options.countElements - Elements for displaying count information (optional)
 * @param {HTMLElement} options.countElements.start - Element to display start index
 * @param {HTMLElement} options.countElements.end - Element to display end index
 * @param {HTMLElement} options.countElements.total - Element to display total count
 * @param {string} options.prevBtnSelector - Selector for previous page button (optional)
 * @param {string} options.nextBtnSelector - Selector for next page button (optional)
 * @param {string} options.prevBtnMobileSelector - Selector for mobile previous page button (optional)
 * @param {string} options.nextBtnMobileSelector - Selector for mobile next page button (optional)
 * @returns {Object} Pagination controller
 */
function createPagination(options) {
    const {
        data,
        itemsPerPage = 10,
        renderItemCallback,
        containerSelector,
        paginationContainerSelector,
        emptyCallback,
        countElements,
        prevBtnSelector,
        nextBtnSelector,
        prevBtnMobileSelector,
        nextBtnMobileSelector
    } = options;
    
    let currentPage = 1;
    
    // Get DOM elements
    const container = document.querySelector(containerSelector);
    const paginationContainer = document.querySelector(paginationContainerSelector);
    const prevBtn = prevBtnSelector ? document.querySelector(prevBtnSelector) : null;
    const nextBtn = nextBtnSelector ? document.querySelector(nextBtnSelector) : null;
    const prevBtnMobile = prevBtnMobileSelector ? document.querySelector(prevBtnMobileSelector) : null;
    const nextBtnMobile = nextBtnMobileSelector ? document.querySelector(nextBtnMobileSelector) : null;
    
    // Function to render the current page
    function render() {
        if (!container) {
            console.error(`Container not found: ${containerSelector}`);
            return;
        }
        
        if (!data || data.length === 0) {
            if (emptyCallback) {
                emptyCallback(container);
            } else {
                container.innerHTML = `<tr><td colspan="100%" class="px-6 py-4 text-center text-gray-500">Nenhum item encontrado</td></tr>`;
            }
            
            if (paginationContainer) {
                paginationContainer.classList.add('hidden');
            }
            
            return;
        }
        
        // Calculate pagination
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, data.length);
        const currentPageData = data.slice(startIndex, endIndex);
        
        // Clear the container
        container.innerHTML = '';
        
        // Render each item in the current page
        currentPageData.forEach(item => {
            renderItemCallback(container, item, startIndex);
        });
        
        // Update count elements if provided
        if (countElements) {
            if (countElements.start) countElements.start.textContent = data.length > 0 ? startIndex + 1 : 0;
            if (countElements.end) countElements.end.textContent = endIndex;
            if (countElements.total) countElements.total.textContent = data.length;
        }
        
        // Update pagination UI
        if (paginationContainer) {
            paginationContainer.classList.remove('hidden');
            updatePaginationButtons(totalPages);
        }
        
        // Update navigation buttons
        updateNavigationButtons(totalPages);
        
        // Dispatch a custom event to notify that pagination rendering is complete
        const paginationEvent = new CustomEvent('paginationRendered', {
            detail: {
                container: container,
                selector: containerSelector,
                currentPage: currentPage,
                totalPages: totalPages
            }
        });
        document.dispatchEvent(paginationEvent);
    }
    
    // Function to update pagination buttons
    function updatePaginationButtons(totalPages) {
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = '';
        
        // Determine which page numbers to show
        const maxPageButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
        
        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }
        
        // Create pagination buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                i === currentPage 
                    ? 'bg-blue-50 border-blue-500 text-blue-600 z-10' 
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            }`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => goToPage(i));
            paginationContainer.appendChild(pageButton);
        }
    }
    
    // Function to update navigation buttons
    function updateNavigationButtons(totalPages) {
        const buttons = [
            { element: prevBtn, disabled: currentPage === 1 },
            { element: nextBtn, disabled: currentPage === totalPages },
            { element: prevBtnMobile, disabled: currentPage === 1 },
            { element: nextBtnMobile, disabled: currentPage === totalPages }
        ];
        
        buttons.forEach(({element, disabled}) => {
            if (!element) return;
            
            element.disabled = disabled;
            
            if (disabled) {
                element.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                element.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });
    }
    
    // Function to go to a specific page
    function goToPage(page) {
        currentPage = page;
        render();
    }
    
    // Function to go to the previous page
    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            render();
        }
    }
    
    // Function to go to the next page
    function nextPage() {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            render();
        }
    }
    
    // Set up event listeners for navigation buttons
    function setupEventListeners() {
        if (prevBtn) {
            prevBtn.addEventListener('click', prevPage);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextPage);
        }
        
        if (prevBtnMobile) {
            prevBtnMobile.addEventListener('click', prevPage);
        }
        
        if (nextBtnMobile) {
            nextBtnMobile.addEventListener('click', nextPage);
        }
    }
    
    // Initialize
    setupEventListeners();
    
    // Public methods
    return {
        render,
        goToPage,
        prevPage,
        nextPage,
        getCurrentPage: () => currentPage,
        updateData: (newData) => {
            options.data = newData;
            currentPage = 1;
            render();
        }
    };
} 