$(document).ready(async function(){
    await connect();
    await isOwnerAddress();
    await addFactoryBtn();
});
