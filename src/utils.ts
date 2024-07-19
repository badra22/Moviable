const update_pagination = function(curr_page) {
    // remove the old pagination list
    const pagination_section = document.querySelector('.custom-pagination');
    const last_pagination = document.querySelector('.custom-pagination div');
    if(last_pagination && pagination_section)pagination_section.removeChild(last_pagination);
    
    // make the list on page numbers for the new one
    let pages;
    if(curr_page <= 1) {
        pages = [curr_page, curr_page + 1, curr_page + 2, curr_page + 3];   
    }
    else {
        pages = [curr_page - 1, curr_page, curr_page + 1, curr_page + 2];
    }

    // create the new pagination list
    const current_pagination = document.createElement('div');
    let current_url = new URL(location.href);
    if(curr_page > 1) {
        const prev = document.createElement('a');
        prev.classList.add("text-light");
        current_url.searchParams.set('page', `${curr_page - 1}`);
        prev.href = current_url.toString();
        prev.innerText = '<<';
        current_pagination.appendChild(prev);
    }

    pages.forEach(page => {
        const e = document.createElement('a');
        e.classList.add("text-light");
        current_url.searchParams.set('page', `${page}`);
        e.href = current_url.toString();
        e.innerText = page;
        if(page == curr_page)e.classList.add(...("text-light active".split(' ')));
        current_pagination.appendChild(e);
    })

    const next = document.createElement('a');
    next.classList.add("text-light");
    current_url.searchParams.set('page', `${curr_page + 1}`);
    next.href = current_url.toString();
    next.innerText = '>>';
    current_pagination.appendChild(next);

    if(pagination_section)pagination_section.appendChild(current_pagination);
}



const remove_pagination = function() {
    const pagination_section = document.querySelector('.custom-pagination');
    const last_pagination = document.querySelector('.custom-pagination div');
    if(last_pagination && pagination_section)pagination_section.removeChild(last_pagination);
}

function getParameterByName(name : string) : any {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const utils = {
    update_pagination,
    remove_pagination,
    getParameterByName
}

export default utils;