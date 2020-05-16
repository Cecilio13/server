const keys = require('../config/keys');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//models
const companies = mongoose.model('companies');
const users = mongoose.model('users');

module.exports = app => {
    app.get('/api/get_companies', async (req, res) => {
        const request = req.query;
        const result = await companies.find();
        res.send(result);
    });

    //get staff data
    app.get('/staff', function(req, res){
        users.find(function(err, users){
            if(err){
                console.log('failed');
            }
            else{
                res.json(users);
            }
        });
    });

    // add staff
    app.post('/staff/add', function(req, res){
        let user = new users(req.body);
        user.save()
            .then(user => {
                res.status(200).json({'user': 'added'});
            })
            .catch(err => {
                res.status(400).send('failed adding staff');
            });
    });

    // update status active or disabled
    var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May','Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = new Date().getDate();
    var month = monthNames[new Date().getMonth()];
    var year = new Date().getFullYear();

    app.post('/staff/update/status', function(req, res){
        for(let i = 0; i < req.body.length; i++){
            users.findById(req.body[i]._id, function(err, user){
                if(!user){
                    res.status(400).send('id not found');
                }
                else{
                    if(user.status === req.body[i].status){
                        console.log(user.name + ' is already active');                        
                    }
                    else{
                        user.status = req.body[i].status;
                        user.action_log.push('Status changed into active at ' + date + '-'+month+'-'+year);

                        user.save()
                            .then(user => {
                                res.json('add status successful')
                            })
                            .catch(err => {
                                res.status(400).send('add status unsuccessful ' + err)
                            });
                    }
                }
            })
        }
    });
    //edit staff info
    app.post('/staff/edit', function(req, res){
        users.findById(req.body._id, function(err, user){
            if(!user){
                res.status(400).send('id not found');
            }
            else{
                user.name = req.body.name,
                user.position = req.body.position,
                user.email = req.body.email,
                user.address = req.body.address,
                user.birthday = req.body.birthday,
                user.username = req.body.username

                user.save()
                    .then(user => {
                        res.json('edit staff info successful')
                    })
                    .catch(err => {
                        res.status(400).send('edit staff info unsuccessful' + err)
                    });
            }
        })
    })
    //edit account info 
    app.post('/profile/edit', function(req, res){
        users.findById(req.body._id, function(err, user){
            if(!user){
                res.status(400).send('id not found');
            }
            else{
                user.name = req.body.name,
                user.password = req.body.password,
                user.email = req.body.email,
                user.address = req.body.address,
                user.birthday = req.body.birthday,
                user.username = req.body.username

                user.save()
                    .then(user => {
                        res.json('edit profile info successful')
                    })
                    .catch(err => {
                        res.status(400).send('edit profile info unsuccessful' + err)
                    });
            }
        })
    });

    //add note
    app.post('/staff/add_note', function(req, res){
        for(let i = 0; i < req.body.length; i++){
            users.findById(req.body[i]._id, function(err, user){
                if(!user){
                    res.status(400).send('id not found');
                }
                else{
                    user.note.push({
                        info: req.body[i].info,
                        status: req.body[i].status
                    })
                    user.save()
                        .then(user => {
                            res.json('add note successful')
                        })
                        .catch(err => {
                            res.status(400).send('add note unsuccessful' + err)
                        });
                }
            })
        }
    });

    //delete note
    app.post('/staff/delete/note', function(req, res){
        users.findById(req.body._id, function(err, user){
            if(!user){
                res.status(400).send('id not found');
            }
            else{
                user.remove(user.note)
                    .then(user => {
                        res.json('remove note successful')
                    })
                    .catch(err => {
                        res.status(400).send('remove note unsuccessful' + err);
                    })
            }
        })
    });
}