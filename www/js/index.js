/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {



        /*
                var attachFastClick = Origami.fastclick;
                attachFastClick(document.body);
        */
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);


        // delete this

        //var buttonTwo = document.getElementById("btntest");
        //buttonTwo.addEventListener('click', function () { alert("Button Clicked"); }, false);

        //buttonTwo.addEventListener('click', this.onDeviceReady.bind(this), false);

        // delete this end


    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        console.log("OnDeviceReady ready")



        /*
                var db = null;
                db = window.sqlitePlugin.openDatabase({ name: 'db/foodapp.db', location: 'default' });

                window.sqlitePlugin.echoTest(function() {
                    console.log('ECHO test OK');
                });
        */
        // delete this

        /*
                this.timerEnd = this.timerStart;

                var parentElement = document.getElementById('millisecondTest');


                this.timerStart = Date.now();

                var differenceMilliseconds = this.timerStart - this.timerEnd;



                parentElement.innerHTML = differenceMilliseconds;

        */
        // delete this end


    },



};

app.initialize();