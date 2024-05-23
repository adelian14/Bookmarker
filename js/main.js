var siteName=document.querySelector('#siteName');
var siteUrl=document.querySelector('#siteURL');
var siteCat=document.querySelector('#cat');
var saveBtn=document.querySelector('#saveBtn');
var allBookmarksContainer = document.querySelector('#tab-0');
var workBookmarksContainer = document.querySelector('#tab-1');
var personalBookmarksContainer = document.querySelector('#tab-2');

var validInput=[0,0];
var allBookmarks=[];
var workBookmarks=[];
var personalBookmarks=[];
var colors=['rgba(55,55,55,.3)','#51C22D','#4FACF7'];
var totalId=0;
if(localStorage.getItem('allBookmarks')){
    allBookmarks = JSON.parse(localStorage.getItem('allBookmarks'));
}
if(localStorage.getItem('workBookmarks')){
    workBookmarks = JSON.parse(localStorage.getItem('workBookmarks'));
}
if(localStorage.getItem('personalBookmarks')){
    personalBookmarks = JSON.parse(localStorage.getItem('personalBookmarks'));
}
if(localStorage.getItem('totalId')){
    totalId=Number(localStorage.getItem('totalId'));
}
updateDisplay();

siteName.addEventListener('input',function(){
    if(!validate(siteName.value,/^[\w_ ]*$/)){
        siteName.classList.remove('is-valid');
        siteName.classList.add('is-invalid');
        siteName.nextElementSibling.classList.remove('opacity-0');
        siteName.nextElementSibling.innerText='Site name must only contain english letters and numbers';
        validInput[0]=0;
    }
    else if(!validate(siteName.value,/^[\w]{3,}[\w_ ]*$/)){
        siteName.classList.remove('is-valid');
        siteName.classList.add('is-invalid');
        siteName.nextElementSibling.classList.remove('opacity-0');
        siteName.nextElementSibling.innerText='Site name must starts with at least 3 chracters';
        validInput[0]=0;
    }
    else{
        siteName.classList.add('is-valid');
        siteName.classList.remove('is-invalid');
        siteName.nextElementSibling.classList.add('opacity-0');
        validInput[0]=1;
    }
});
siteUrl.addEventListener('input',function(){
    if(!validate(siteUrl.value,/^(https:\/\/|http:\/\/)?(www.)?[A-Za-z0-9]{1,256}(\.[a-zA-Z]{2,50})$/)){
        siteUrl.classList.remove('is-valid');
        siteUrl.classList.add('is-invalid');
        if(siteUrl.value.length > 15)
            siteUrl.nextElementSibling.classList.remove('opacity-0');
        validInput[1]=0;
    }
    else{
        siteUrl.classList.add('is-valid');
        siteUrl.classList.remove('is-invalid');
        siteUrl.nextElementSibling.classList.add('opacity-0');
        validInput[1]=1;
    }
});
function validate(name,p){
    return p.test(name);
}

saveBtn.addEventListener('click',function(){
    if(!validInput[0] || !validInput[1]){
        return;
    }
    var bookmarkCat = Number(siteCat.value);
    var sUrl = siteUrl.value;
    if(!sUrl.startsWith('https://') || !sUrl.startsWith('http://'))
        sUrl = 'https://'+sUrl;
    var bookmark = {
        name: siteName.value,
        url: sUrl,
        cat: bookmarkCat,
        trueIndex: totalId
    }
    totalId++;
    allBookmarks.push(bookmark);
    if(bookmarkCat==1) workBookmarks.push(bookmark);
    else if(bookmarkCat==2) personalBookmarks.push(bookmark);
    updateStorage();
    updateDisplay();
    clearFrom();
});

function updateStorage(){
    localStorage.setItem('allBookmarks',JSON.stringify(allBookmarks));
    localStorage.setItem('workBookmarks',JSON.stringify(workBookmarks));
    localStorage.setItem('personalBookmarks',JSON.stringify(personalBookmarks));
    localStorage.setItem('totalId',totalId);
}

function updateDisplay(){
    diplayContainer(allBookmarksContainer,allBookmarks);
    diplayContainer(workBookmarksContainer,workBookmarks);
    diplayContainer(personalBookmarksContainer,personalBookmarks);
}

function clearFrom(){
    siteName.value='';
    siteUrl.value='';
    siteCat.value='0';
    siteUrl.classList.remove('is-valid');
    siteName.classList.remove('is-valid');
}

function buildElement(bookmark,i){
    var e=`
    <div class="row text-center py-2 bg-white">
    <div class="col-2 td d-flex justify-content-center align-items-center"><span class="px-2 rounded-3"
        style="font-family: inherit; background-color: ${colors[bookmark.cat]}">${i}</span></div>
    <div class="col-6 td d-flex justify-content-center align-items-center"><span class="text-truncate"
        style="font-family: inherit;">${bookmark.name}</span></div>
    <div class="col-2 td d-flex justify-content-center align-items-center"><button
        class="btn-success btn px-md-3 py-md-1 rounded-pill btn-row" onclick="visitBookmark('${bookmark.url}')"><i class="fa-solid fa-eye"></i></button>
    </div>
    <div class="col-2 td d-flex justify-content-center align-items-center"><button
        class="btn-danger btn px-md-3 py-md-1 rounded-pill btn-row" onclick="deleteBookmark(${bookmark.trueIndex})"><i class="fa-solid fa-trash"></i></button>
    </div>
    </div>
    `
    return e;
}

function diplayContainer(container,bookmarks){
    var s = '';
    for(let i = 0; i < bookmarks.length; i++){
        s+=buildElement(bookmarks[i],i+1);
    }
    container.innerHTML=s;
}

function visitBookmark(url){
    open(url,'_blank');
}

function deleteBookmark(idx){
    deleteBookmarkFromArray(idx,allBookmarks);
    deleteBookmarkFromArray(idx,workBookmarks);
    deleteBookmarkFromArray(idx,personalBookmarks);
    updateStorage();
    updateDisplay();
}

function deleteBookmarkFromArray(idx,arr){
    var delIdx=-1;
    for(let i = 0; i < arr.length; i++){
        if(arr[i].trueIndex == idx){
            delIdx=i;
            break;
        }
    }
    if(delIdx!=-1) arr.splice(delIdx,1);
}