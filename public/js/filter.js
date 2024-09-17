let filters = document.querySelectorAll('.filter');
for(filter of filters){
    filter.addEventListener('click',()=>{
        let filterName = filter.querySelector('p');
        console.dir(filterName.innerText);
    })
}