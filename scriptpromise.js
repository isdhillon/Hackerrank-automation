//require
const puppeteer=require("puppeteer")
//promise based function
let browser;
let page;
let code;
let language;
puppeteer
//launching browser
.launch({
    //opening the browser is shown
    headless:false,
    defaultViewport:null,
    args:["--start-maximized"],
    slowMo:50
})
.then(function(b){
    browser=b;
    //return pages of the browser in the array
    return browser.pages()
})
.then(function(pages){
    //selecting the first page
    page=pages[0];
    //go to the url
    return page.goto("https://www.hackerrank.com/")
})
//click on login button
.then(function(){
    return Promise.all([
        page.waitForNavigation(),
        page.click(".hr__button.hr__button--sm.hr__button--tertiary.hr__button--tertiary--no-border.menu-item.menu-item-type-post_type.menu-item-object-page.menu-item-2887.menu-item-depth-0"),
    ])
})
//click on login as developer
.then(function(){
    return Promise.all([
        page.waitForNavigation(),
        page.click(".fl-button-wrap.fl-button-width-auto.fl-button-left .fl-button"),
    ])
})
//input email
.then(function(){
    return page.type("#input-1","fapini1089@dmsdmg.com")
})
//input password
.then(function(){
    return page.type("#input-2","123456789")
})
//loggining
.then(function(){
    return Promise.all([
        page.waitForNavigation(),
        page.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"),
    ])
})
//clicking on interview preparation
.then(function(){
    return waitClickNavigate("[title='Interview Preparation Kit']")
})
//opening warmup challenges
.then(function(){
    return waitClickNavigate("[data-attr1='warmup']")
})
//selecting the question
.then(function(){
    return waitClickNavigate(".ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled")
})
//clicking on editior
.then(function(){
    return waitClickNavigate("#tab-1-item-4")
    
})
//click on lock button
.then(function(){
    return handleLockBtn()
})
//copying the code
.then(function(){
    return page.evaluate(function(){
        return document.querySelector(".challenge-editorial-block.editorial-setter-code pre").innerText;
    });
})
//assigning the copied code to variable
.then(function(c){
    code=c;

})
//copying the language
.then(function(){
    return page.evaluate(function(){
        return document.querySelector(".challenge-editorial-block.editorial-setter-code h3").innerText;
    });
})
//assigning the language to the variable
.then(function(l){
    language=l;
    return page.waitForSelector('[data-attr2="Problem"]', {visible: true})

})
//click on problem
.then(function () {
    return page.click('[data-attr2="Problem"]');
})
//pasting the code
.then(function () {
    return pasteCode(code, language);
})
//closing the browser
.then(function () {
    return browser.close();
})
//catch if any error
.catch(function(err){
    console.log(err);
})
//function to manage the lockbutton icon
function handleLockBtn(){
    return new Promise(function(resolve,reject){
        //waiting for the selector
        page.waitForSelector(".ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled")
        .then(function(){
            //task click on the button if available
            return page.click(".ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled");
        }).then(function(){
            //if it is available this lines are executed
            resolve()
        })
        .catch(function(){
            //incase of error these lines are executed
            resolve()
        })
    })
}
//this function is made to reduce repetation of code
function waitClickNavigate(selector){
    return new Promise(function(resolve,reject){//waiting for selector
        page.waitForSelector(selector,{visible:true})
        .then(function(){
            //clicking the selector when its available
            return Promise.all([page.click(selector),
            page.waitForNavigation()])
        })
        .then(function(){
            //this is run in case of nno error
            resolve()
        })
        .catch(function(err){
            //run in case of error
            reject(err)
        })
    })
}
//copy paste function
function pasteCode(code,language){
    //waiting for checkbox selector
    return page.waitForSelector("[type='checkbox']",{visible:true})
    .then(function(){
        //selecting the checkbox
        return page.click("[type='checkbox']")
    })
    .then(function(){
        //selecting the custom input box
        return page.click("#input-1")
    })
    .then(function(){
        //writing code in the input box
        return page.type("#input-1", code)
    })//cuting the code form the box
    .then(function(){
        return page.keyboard.down('Control');
    })
    .then(function(){
        return page.keyboard.press("A")
    })
    .then(function(){
        return page.keyboard.press("X")
    })
    .then(function(){
        return page.keyboard.up("Control")
    })
    //selecting language input
    .then(function () {
        return page.click('.css-1hwfws3');
    }).then(function () {
        //input the selected langauge above
        return page.type('.css-1hwfws3', language);
    }).then(function () {
        //press enter
        return page.keyboard.press("Enter");
    }).then(function () {
        return page.keyboard.down("Control");
    })
    .then(function () {
        //selecting the existing code in the code area
        return page.click(".view-lines");
    }).then(function () {
        //pasting the code we cut arlier form the custom input box
        return page.keyboard.press('A');
    }).then(function () {
        return page.keyboard.press('V');
    }).then (function () {
        return page.keyboard.up("Control");
    }).then(function () {
        //submiting the code
        return page.click(".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled");
    });


}