app.get("/region",async(req,res)=>{
    const thisUser = req.user
    const indiaStates = State.getStatesOfCountry('IN');
    const message = req.flash('message');
    req.flash('message',"")
    // console.log(indiaStates);
    try {
        if (req.isAuthenticated()) {
            const rData = await StateSchema.find();
            res.render('region', {thisUser,rData,indiaStates,message});
        }
        else {
            res.redirect('/')
        }
    } catch (e) {
        console.log(e)
    }
})
app.post("/delete_region", async (req, res) => {
    try {
        await StateSchema.deleteOne({_id:req.body.rid});
        res.redirect('/region')
    } catch (e) {
        console.log(e);
        res.send("internal server error to delete the state")
    }
})

app.post("/addState", async (req, res) => {
    try{
            if (req.isAuthenticated())
            {
                const thisUser = req.user
                let state_codes={'AD': 37,'AR': 12,'AS': 18,'BR': 10,'CG': 22,'DL': 7,'GA': 30,'GJ': 24,'HR': 6,'HP': 2,'JK': 1,'JH': 20,'KA': 29,'KL': 32,'LD': 31,'MP': 23,'MH': 27,'MN': 14,'ML': 17,'MZ': 15,'NL': 13,'OD': 21,'PY': 34,'PB': 3,'RJ': 8,'SK': 11,'TN': 33,'TS': 36,'TR': 16,'UP': 9,'UK': 5,'WB': 19}
                if(state_codes[req.body.State]==req.body.State_code){
                    const temp = State.getStateByCodeAndCountry(req.body.State,"IN");
                    const Rdata = new StateSchema({ User_id:req.body.User_id, State:temp.name ,State_code:req.body.State_code,State_ISOcode:req.body.State})
                    await Rdata.save();
                    res.redirect('/region')
                }
                else{
                    req.flash('message','invalid state code');
                    res.redirect('/region')
                }
            }
            else{
                res.redirect('/');
            }
    }
    catch (e) {
        console.log(e);
        res.status(400).redirect("/region");
    }
});




