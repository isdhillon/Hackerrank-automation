//require
const puppeteer=require("puppeteer");
//promise based function
let url="https://www.hackerrank.com/"
let page;
async function fn(){
    try{
        let browser=await puppeteer.launch({
            //opening the browser is shown
            headless:false,
            defaultViewport:null,
            args:["--start-maximized"],
        });
        let pagesArr=await browser.pages();
        page=pagesArr[0];
        await page.goto(url);
        await waitClickNavigate(".hr__button.hr__button--sm.hr__button--tertiary.hr__button--tertiary--no-border.menu-item.menu-item-type-post_type.menu-item-object-page.menu-item-2887.menu-item-depth-0")
        await waitClickNavigate(".fl-button-wrap.fl-button-width-auto.fl-button-left .fl-button")
        await page.waitForSelector("#input-1")
        await page.type("#input-1","fapini1089@dmsdmg.com",{delay:100});
        await page.type("#input-2","123456789",{delay:100});
        await page.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled")
        await waitClickNavigate("[title='Interview Preparation Kit'] a")
        await waitClickNavigate("[data-attr1='warmup']")
        await page.waitForSelector(".js-track-click.challenge-list-item",{visible:true})
        let hrefArr=await page.evaluate(function(){
            let allBtns=document.querySelectorAll(".js-track-click.challenge-list-item")
            let hrefArr=[];
            for(let i=0;i<allBtns.length;i++){
                let href=allBtns[i].getAttribute("href");
                hrefArr.push(href)
            }
            return hrefArr
        })
        for(let i=0;i<hrefArr.length;i++){
            let link=url+hrefArr[i];
            await submitCode(link);
        }
        

    }catch(err){
        console.log(err);
    }
}
fn();
async function waitClickNavigate(selector){
    try{

    
    //waiting for selector
    await page.waitForSelector(selector,{visible:true})
    //clicking the selector when its available        
    await Promise.all([page.waitForNavigation(),page.click(selector)])
    }catch(err){
        console.log(err);
    }
}
async function handleLockBtn(selector){
    try{
        //waiting for the selector
        await page.waitForSelector(selector,{visible:true,timeout:5000})
            //task click on the button if available
            await page.click(selector);
    }catch(err){
        console.log(err);
    }
}
async function pasteCode(code,language){
    try{
    //waiting for checkbox selector
    await page.waitForSelector("[type='checkbox']",{visible:true})
        //selecting the checkbox
        await page.click("[type='checkbox']")
        //selecting the custom input box
        await page.click("#input-1")
        //writing code in the input box
        await page.type("#input-1", code)
        //cuting the code form the box
        await page.keyboard.down('Control');
        await page.keyboard.press("A")
        await page.keyboard.press("X")
        await page.keyboard.up("Control")
    //selecting language input
        await page.click('.css-1hwfws3');
        //input the selected langauge above
        await page.type('.css-1hwfws3', language);
        //press enter
        await page.keyboard.press("Enter");
        await page.keyboard.down("Control");
        //selecting the existing code in the code area
        await page.click(".view-lines");
        //pasting the code we cut arlier form the custom input box
        await page.keyboard.press('A');
        await page.keyboard.press('V');
        await page.keyboard.up("Control");
        //submiting the code
        await page.click(".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled");
    }catch(err){
        console.log(err);
    }

}
async function submitCode(link){
    await page.goto(link);
    await waitClickNavigate("[data-attr2='Editorial']")
        await handleLockBtn(".editorial-content-locked .ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled")
        await page.waitForSelector(".challenge-editorial-block.editorial-setter-code pre", { visible: true });
        let code=await page.evaluate(function(){
            return document.querySelector(".challenge-editorial-block.editorial-setter-code pre").innerText;
        });
        await page.waitForSelector(".challenge-editorial-block.editorial-setter-code h3", { visible: true });
        let language=await page.evaluate(function(){
            return document.querySelector(".challenge-editorial-block.editorial-setter-code h3").innerText;
        });
        await page.waitForSelector('[data-attr2="Problem"]', {visible: true})
        await page.click('[data-attr2="Problem"]');
        await pasteCode(code, language);

}