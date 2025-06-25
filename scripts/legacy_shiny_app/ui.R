library(shiny)
library(shinyjs)
library(DT)
library(shinythemes)
library(shinyWidgets)
library(shinyalert)





function(request) {
  shinyUI(
    fixedPage(
      # theme = "shiny.css",
      # style = "width: 1325px",
      
      # shinythemes::themeSelector(),
      
      shinyjs::useShinyjs(),
      
      # tags$style(type="text/css", css),
      
      tags$head(
        singleton(tags$script(src = 'events.js'))
      ),
      
      div(
        id = "container",
        
        # div(
        #   id = "header",
        #   HTML('<p align="left" style="margin:0px"><img src="title.png" width="100%"></p>'),
        #   style = "margin-top:0px"
        # ),
        
        
        div(
          id = "main",
          
          
          navbarPage(
            theme = "yeti.min.css",
                        id = "inTabset",
            
            windowTitle = "Early Predict Ovarian Response & Deploy Individualized Ovarian Stimulation Strategies",
            
            tags$head(
              tags$style(
                type = 'text/css',
                # '.navbar { background-color: #437A8B;
                # font-family: Arial;
                # font-size: 18px;
                # color: white;font-weight:bold;margin-top:-5px}',
                # 
                # '.navbar-dropdown { background-color: #437A8B;
                # font-family: Arial;
                # font-size: 18px;
                # color: white;font-weight:bold;margin-top:-5px}',
                '.mainDiv {
                background-color: #437A8B;
                font-family: Calibri;
                font-size: 18px;
                color: white;font-weight:bold;margin-top:-5px}',
                
                '.panel-heading {
                padding: 10px 15px;
                border-bottom: 1px solid transparent;
                border-top-left-radius: 3px;
                border-top-right-radius: 3px;
                color: #333;
                background-color: #f5f5f5;
                border-color: #f5f5f5;
}',
                '.panel-body {
                padding: 10px;
                }',
                '.panel-default {
                margin-bottom: 20px;
                background-color: #f5f5f517;
                border: 1px solid transparent;
                border-radius: 4px;
                box-shadow: 0 1px 1px rgb(0 0 0 / 5%);
                border-color: #d2d1d1;
                padding-bottom: 20px;
                }',
                '.panel-title-blue {
                color: #437a8b;
                background-color: #437a8b38;
                border-color: #437a8b38;
                padding: 5px;
                margin-bottom: 20px;
                border: 1px solid transparent;
                border-radius: 4px;
                text-align:center;
                }'
              )
              ),
            
            tabPanel(
              "Home",
              
              
              #******************************************************************************************************
              ### ========================================  Step 1 START  ===========================================
              #******************************************************************************************************
              div(
                id = 'st1',
                class = "mainDiv",
                style = "background-color: white;border-style: solid;border-color:white;color:black;display:block;margin-left:-25px;margin-top:0px;margin-right:-30px;",
                # sidebarPanel(
                #   width = 0
                # ),
                mainPanel(
                  width = 12,
                  div(
                    id = "home-page",
                    class = "panel-default",
                    div(class="panel-heading"),
                    div(class="panel-body",
                        div(class="panel-title-blue", 
                            
                            p("An ML System for Predicting Ovarian Response & Deploying Ovarian Stimulation Strategies", style="margin:0px; font-size:22px; font-weight:600;")),
                        
                        div(p("Key Features Required for Both POR and HOR Prediction", style="margin:0px; font-size:22px; font-weight:600; text-align:center"),style="magin-top:-10px; margin-bottom:20px"),
                        
                        fluidRow(
                          
                          column(3, align = "right",
                                 div(
                                   p("Age of Patient:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                 )),
                          column(
                            1,
                            align = "left",
                            div(
                              numericInput(
                                "Age",
                                NULL,
                                value = NULL,
                                
                                
                              ),
                              style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                            ),
                          ),
                          column(1, align = "left",
                                 div(
                                   p("year old", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:400;margin-left:-20px")
                                 )),
                          column(1, align = "left"),
                          column(3, align = "right",
                                 div(
                                   p("Duration of infertility:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                 )),
                          column(
                            1,
                            align = "left",
                            div(
                              numericInput(
                                "Duration",
                                NULL,
                                value = NULL,
                                
                                
                              ),
                              style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                            ),
                          ),
                          column(1, align = "left",
                                 div(
                                   p("year", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:400;margin-left:-20px")
                                 )),
                          column(1, align = "left"),

                          
                          style="margin-bottom: 10px;"
                        ),
                        
                        fluidRow(
                          
                          column(3, align = "right",
                                 div(
                                   p("Weight of Patient:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                 )),
                          column(
                            1,
                            align = "left",
                            div(
                              numericInput(
                                "Weight",
                                NULL,
                                value = NULL,
                                
                                
                              ),
                              style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                            ),
                          ),
                          column(1, align = "left",
                                 div(
                                   p("kg", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:400;margin-left:-20px")
                                 )),
                          # column(1, align = "left"),
                          column(4, align = "right",
                                 div(
                                   p("Basal follicle-stimulating hormone:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                 )),
                          column(
                            1,
                            align = "left",
                            div(
                              numericInput(
                                "FSH",
                                NULL,
                                value = NULL,
                                
                                
                              ),
                              style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                            ),
                          ),
                          column(1, align = "left",
                                 div(
                                   p("IU/L", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:400;margin-left:-20px")
                                 )),
                          column(1, align = "left"),
                          
                          
                          style="margin-bottom: 10px;"
                        ),
                        
                        
                        
                        
                        fluidRow(
                          
                          column(3, align = "right",
                                 div(
                                   p("AMH:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                 )),
                          column(
                            1,
                            align = "left",
                            div(
                              numericInput(
                                "AMH",
                                NULL,
                                value = NULL,
                                
                                
                              ),
                              style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                            ),
                          ),
                          column(1, align = "left",
                                 div(
                                   p("ng/mL", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:400;margin-left:-20px")
                                 )),
                          column(1, align = "left"),
                          column(3, align = "right",
                                 div(
                                   p("Basal luteinizing hormone:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                 )),
                          column(
                            1,
                            align = "left",
                            div(
                              numericInput(
                                "LH",
                                NULL,
                                value = NULL,
                                
                                
                              ),
                              style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                            ),
                          ),
                          column(1, align = "left",
                                 div(
                                   p("IU/L", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:400;margin-left:-20px")
                                 )),
                          column(1, align = "left"),
                          
                          
                          style="margin-bottom: 10px;"
                        ),
                        
                        fluidRow(
                          
                          column(3, align = "right",
                                 div(
                                   p("Basal AFC:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                 )),
                          column(
                            1,
                            align = "left",
                            div(
                              numericInput(
                                "AFC",
                                NULL,
                                value = NULL,
                                
                                
                              ),
                              style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                            ),
                          ),
                          column(1, align = "left",
                                 div(
                                   p("n", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:400;margin-left:-20px")
                                 )),
                          column(1, align = "left"),
                          column(3, align = "right",
                                 div(
                                   p("POI or DOR:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                 )),
                          column(
                            2,
                            align = "left",
                            div(                                                                                                                                                                                                                                                                                                                  
                              awesomeRadio(
                                "POIorDOR",
                                NULL,
                                choices = c(
                                  "Yes" = 1,
                                  "No" = 2
                                ),
                                selected = NULL,
                                inline = TRUE
                              ),
                              style = "font-weight:bold; font-size:20px; font-family:Calibri;margin-top:2px"
                            )
                          ),

                          column(1, align = "left"),
                          
                          
                          style="margin-bottom: 10px;"
                        ),
                        
                        fluidRow(
                          
                          column(3, align = "right",
                                 div(
                                   p("Predicting POR and/or HOR:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                 )),
                          column(
                            7,
                            align = "left",
                            div(
                              awesomeRadio(
                                "PORorHOR",
                                NULL,
                                choices = c(
                                  "POR" = 1,
                                  "HOR" = 2,
                                  "Both" =3
                                ),
                                selected = 3,
                                inline = TRUE
                              ),
                              style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                            ),
                          ),
                          
                          column(1, align = "left"),
                          
                          
                          style="margin-bottom: 10px;"
                        ),
                        
                        conditionalPanel(condition="input.PORorHOR == '1' || input.PORorHOR == '3'",
                                         div(p("Unique Key Features Required for POR Prediction", style="margin:0px; font-size:22px; font-weight:600; text-align:center"),style="magin-top:-10px; margin-bottom:20px"),
                                         
                                         fluidRow(
                                           
                                           column(3, align = "right",
                                                  div(
                                                    p("Diastolic blood pressure:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                                  )),
                                           column(
                                             1,
                                             align = "left",
                                             div(
                                               numericInput(
                                                 "DBP",
                                                 NULL,
                                                 value = NULL,
                                                 
                                                 
                                               ),
                                               style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                                             )
                                           ),
                                           column(1, align = "left",
                                                  div(
                                                    p("mmHg", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:400;margin-left:-20px")
                                                  )),
                                           column(1, align = "left"),
                                           column(3, align = "right",
                                                  div(
                                                    p("White blood cell count:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                                  )),
                                           column(
                                             1,
                                             align = "left",
                                             div(
                                               numericInput(
                                                 "WBC",
                                                 NULL,
                                                 value = NULL,
                                                 
                                                 
                                               ),
                                               style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                                             )
                                           ),
                                           column(1, align = "left",
                                                  div(
                                                    HTML('<p style="color:black; font-size: 20px;font-family:Calibri;font-weight:400;margin-left:-20px">10<sup>9</sup>/L</p>')
                                                  )),
                                           column(1, align = "left"),
                                           
                                           
                                           style="margin-bottom: 10px;"
                                         ),
                                         
                                         
                                         fluidRow(
                                           
                                           column(3, align = "right",
                                                  div(
                                                    p("Red blood cell count:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                                  )),
                                           column(
                                             1,
                                             align = "left",
                                             div(
                                               numericInput(
                                                 "RBC",
                                                 NULL,
                                                 value = NULL,
                                                 
                                                 
                                               ),
                                               style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                                             )
                                           ),
                                           column(1, align = "left",
                                                  div(
                                                    HTML('<p style="color:black; font-size: 20px;font-family:Calibri;font-weight:400;margin-left:-20px">10<sup>12</sup>/L</p>')
                                                  )),
                                           column(1, align = "left"),
                                           column(3, align = "right",
                                                  div(
                                                    p("Alanine aminotransferase:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                                  )),
                                           column(
                                             1,
                                             align = "left",
                                             div(
                                               numericInput(
                                                 "ALT",
                                                 NULL,
                                                 value = NULL,
                                                 
                                                 
                                               ),
                                               style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                                             )
                                           ),
                                           column(1, align = "left",
                                                  div(
                                                    HTML('<p style="color:black; font-size: 20px;font-family:Calibri;font-weight:400;margin-left:-20px">IU/L</p>')
                                                  )),
                                           column(1, align = "left"),
                                           
                                           
                                           style="margin-bottom: 10px;"
                                         ),
                                         
                                         fluidRow(
                                           
                                           column(3, align = "right",
                                                  div(
                                                    p("Basal progesterone:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                                  )),
                                           column(
                                             1,
                                             align = "left",
                                             div(
                                               numericInput(
                                                 "P",
                                                 NULL,
                                                 value = NULL,
                                                 
                                                 
                                               ),
                                               style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                                             ),
                                           ),
                                           column(1, align = "left",
                                                  div(
                                                    HTML('<p style="color:black; font-size: 20px;font-family:Calibri;font-weight:400;margin-left:-20px">ng/mL</p>')
                                                  )),
                                           column(1, align = "left"),
                                           column(3, align = "right",),
                                           column(1,align = "left"),
                                           column(1,align = "left"),
                                           column(1, align = "left"),
                                           
                                           
                                           style="margin-bottom: 10px;"
                                         ),
                                         ),
                        
                        conditionalPanel(condition = "input.PORorHOR == '2' || input.PORorHOR == '3'",
                                         div(p("Unique Key Features Required for HOR Prediction", style="margin:0px; font-size:22px; font-weight:600; text-align:center"),style="magin-top:-10px; margin-bottom:20px"),
                                         
                                         fluidRow(
                                           
                                           column(3, align = "right",
                                                  div(
                                                    p("Platelet count:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                                  )),
                                           column(
                                             1,
                                             align = "left",
                                             div(
                                               numericInput(
                                                 "PLT",
                                                 NULL,
                                                 value = NULL,
                                                 
                                                 
                                               ),
                                               style = "font-weight:bold; font-size:20px; font-family:Calibri;"
                                             ),
                                           ),
                                           column(1, align = "left",
                                                  div(
                                                    HTML('<p style="color:black; font-size: 20px;font-family:Calibri;font-weight:400;margin-left:-20px">10<sup>9</sup>/L</p>')
                                                  )),
                                           column(1, align = "left"),
                                           column(3, align = "right",
                                                  div(
                                                    p("Polycystic ovarian syndrome:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                                  )),
                                           column(
                                             2,
                                             align = "left",
                                             div(                                                                                                                                                                                                                                                                                                                  
                                               awesomeRadio(
                                                 "PCOS",
                                                 NULL,
                                                 choices = c(
                                                   "Yes" = 1,
                                                   "No" = 2
                                                 ),
                                                 selected = NULL,
                                                 inline = TRUE
                                               ),
                                               style = "font-weight:bold; font-size:20px; font-family:Calibri;margin-top:2px"
                                             )
                                           ),
                                           
                                           column(1, align = "left"),
                                           
                                           
                                           style="margin-bottom: 10px;"
                                         ),
                                         ),
                        
                        div(p("POR: Poor Ovarian Response; HOR: Hyper Ovarian Response;", style="margin:0px; font-size:18px; font-weight:300; text-align:center"),style="magin-top:-10px; margin-bottom:20px"),
                        div(p("POI: Primary Ovarian Insuficiency; DOR: Diminished Ovarian Reserve", style="margin:0px; font-size:18px; font-weight:300; text-align:center"),style="magin-top:-10px; margin-bottom:20px"),
                        
                        fluidRow(
                          column(
                            12,
                            align = "center",
                            offset = 0,
                            div(
                              materialSwitch(
                                inputId = "try_example",
                                label = "Try Example: ", 
                                value = FALSE,
                                status = "primary",
                              ),
                              style = "font-weight:bold; font-size:20px;"
                            ),

                            
                            tags$style(
                              type = 'text/css',
                              "#button { vertical-align: middle; height: 50px; width: 100%; font-size: 30px;}"
                            )
                          )
                          
                        ),
                        
                        fluidRow(
                          column(
                            12,
                            align = "center",
                            offset = 0,
                            
                            actionButton(
                              'start',
                              strong('Submit'),
                              class = "btn-red",
                              style = "font-size: 22px;padding-left:20px;padding-right:20px;margin-bottom:-5px"
                            ),
                            
                            
                            tags$style(
                              type = 'text/css',
                              "#button { vertical-align: middle; height: 50px; width: 100%; font-size: 30px;}"
                            )
                          )
                          
                        ),
                        
                        
                        
                          )
                    
                                           ),
                        )
                        ),

              
              #******************************************************************************************************
              ### ========================================  Step 1 END=================================================
              #******************************************************************************************************
              
              
              
              #******************************************************************************************************
              ### ========================================  Step 2 START=================================================
              #******************************************************************************************************
              
              div(
                id = 'st2',
                class = "mainDiv",
                style = "background-color: white;border-style: solid;border-color:white;color:black;display:none;margin-left:-25px;margin-top:0px;margin-right:-30px;",
                # sidebarPanel(
                #   width = 0
                # ),
                mainPanel(
                  width = 12,
                  div(
                    id = "home-page2",
                    class = "panel-default",
                    div(class="panel-heading"),
                    div(class="panel-body",
                        div(class="panel-title-blue", 
                            
                            p("Prediction Results of Abnormal Ovarian Response", style="margin:0px; font-size:22px; font-weight:600;")),
                        
                        conditionalPanel(
                          condition = "!output.Diagnosing_result",
                          br(),
                          br(),
                          br(),
                          br(),
                          br(),
                          HTML('<p align="center"><img src="refresh.gif" width= "10%"></p>'),
                          br()
                        ),
                        
                        htmlOutput("Diagnosing_result"),
                        
                        div(class="panel-title-blue", 
                            
                            p("Deployment of Ovarian Stimulation (OS) Strategies", style="margin:0px; font-size:22px; font-weight:600;")),

                        htmlOutput("strategy_notice2"),
                        fluidRow(
                          column(3, align = "left"),
                          column(
                            8,
                            align = "left",
                            div(
                              awesomeRadio(
                                "mission_type",
                                NULL,
                                choices = c(
                                  "Full Scaning" = 1,
                                  "Specific Testing" = 2
                                ),
                                selected = "1",
                                inline = TRUE
                              ),
                              style = "font-weight:bold; font-size:24px; font-family:Calibri;margin-top:-10px;"
                            ),
                          ),
                          column(1, align = "left"),
                          style="margin-bottom: 10px;"
                        ),
                        
                        conditionalPanel(condition = "input.mission_type == '2'",
                                         div(p("Please Select the Ovarian Stimulation Strategy for Prediction", style="margin:0px; font-size:22px; font-weight:600; text-align:center"),style="magin-top:-10px; margin-bottom:20px"),
                                         
                                         fluidRow(
                                           
                                           column(3, align = "right",
                                                  div(
                                                    p("Ovarian stimulation protocol:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                                  )),
                                           column(
                                             2,
                                             align = "left",
                                             div(
                                               selectInput(
                                                 "Protocol",
                                                 NULL,
                                                 c("Long"=1, "Ultra-long"=2, "Short"=3, "Antagonist"=4, "Mild or Natural"=5, "PPOS"=6, "Other protocol"=7),
                                               ),
                                               style = "font-weight:500; font-size:18px; font-family:Calibri;"
                                             ),
                                           ),
                                           column(1, align = "left"),
                                           column(3, align = "right",
                                                  div(
                                                    p("Starting dose of FSH:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                                  )),
                                           column(
                                             2,
                                             align = "left",
                                             div(
                                               selectInput(
                                                 "Initial.FSH",
                                                 label = NULL,
                                                 c(
                                                   "225 IU" = 1,
                                                   "≤100 IU" = 2,
                                                   "150 IU" = 3,
                                                   "200 IU" = 4,
                                                   "≥300 IU" = 5,
                                                   "Neither agonist or antagonist protocol" = 6
                                                 ),
                                                 selected = 0
                                               ),
                                               style = "font-weight:500; font-size:18px; font-family:Calibri;"
                                             ),
                                           ),
                                           column(1, align = "left"),
                                           
                                           
                                           style="margin-bottom: 10px;"
                                         ),
                                         
                                         fluidRow(
                                           
                                           column(3, align = "right",
                                                  div(
                                                    p("Using rFSH:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                                  )),
                                           column(
                                             2,
                                             align = "left",
                                             div(
                                               selectInput(
                                                 "Recombinant",
                                                 NULL,
                                                 c("Yes"=1, "No"=2, "None"=3)
                                               ),
                                               style = "font-weight:500; font-size:18px; font-family:Calibri;"
                                             ),
                                           ),
                                           column(1, align = "left"),
                                           column(3, align = "right",
                                                  div(
                                                    p("Using LH:", style = "color:black; font-size: 20px;font-family:'Calibri';font-weight:500;")
                                                  )),
                                           column(
                                             2,
                                             align = "left",
                                             div(
                                               selectInput(
                                                 "Use.LH",
                                                 label = NULL,
                                                 c("Yes"=1, "No"=2, "None"=3)
                                               ),
                                               style = "font-weight:500; font-size:18px; font-family:Calibri;"
                                             ),
                                           ),
                                           column(1, align = "left"),
                                           
                                           
                                           style="margin-bottom: 10px;"
                                         ),
                                         
                                         ),

                        fluidRow(
                          column(
                            12,
                            align = "center",
                            offset = 0,

                            actionButton(
                              'start_strategy',
                              strong('Process'),
                              class = "btn-red",
                              style = "font-size: 22px;padding-left:20px;padding-right:20px;margin-bottom:-5px"
                            ),


                            tags$style(
                              type = 'text/css',
                              "#button { vertical-align: middle; height: 50px; width: 100%; font-size: 30px;}"
                            )
                          )

                        ),
                        
                        conditionalPanel(condition="input.mission_type == '1' && input.start_strategy",
                                         
                                         conditionalPanel(condition="input.PORorHOR == '1' || input.PORorHOR == '3'",
                                                          fluidRow(
                                                            column(
                                                              8,
                                                              align = "center",
                                                              offset = 0,
                                                              HTML("
                                                                   <div style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; font-weight:100'>
                                                                   <ul>
                                                                   <li><b>Full List of Available OS Strategies (POR will not appear, but HOR is possible)</b></li>
                                                                   </ul>
                                                                   </div>
                                                                   "), 
                                                              ),
                                                            column(
                                                              4,
                                                              align="left",
                                                              offset=0,
                                                              conditionalPanel(condition="output.POR_table",
                                                                               downloadButton(
                                                                                 "final_POR_table",
                                                                                 label = strong("Download", style = "color: black; border-color: red")
                                                                               ))
                                                            ),
                                                            column(1,align = "center",offset = 0),
                                                            column(
                                                              11,
                                                              align = "center",
                                                              offset = 0,
                                                              conditionalPanel(
                                                                condition = "!output.POR_table",
                                                                br(),
                                                                br(),
                                                                br(),
                                                                br(),
                                                                br(),
                                                                HTML('<p align="center"><img src="refresh.gif" width= "10%"></p>'),
                                                                br()
                                                              ),
                                                              div(dataTableOutput("POR_table"),style="text-align: left; font-size: 18px; font-family: Calibri; color: black; margin: 8px; font-weight:100; margin-left:80px"),
                                                            ),
                                                            # column(1,align = "center",offset = 0)
                                                            
                                                              ),
                                                          
                                         ),
                                         conditionalPanel(condition="input.PORorHOR == '2' || input.PORorHOR == '3'",
                                                          fluidRow(
                                                            column(
                                                              8,
                                                              align = "center",
                                                              offset = 0,
                                                              HTML("
                                                                   <div style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; font-weight:100'>
                                                                   <ul>
                                                                   <li><b>Full List of Available OS Strategies (HOR will not appear, but POR is possible)</b></li>
                                                                   </ul>
                                                                   </div>
                                                                   "), 
                                                              ),
                                                            column(
                                                              4,
                                                              align="left",
                                                              offset=0,
                                                              conditionalPanel(condition="output.HOR_table",
                                                                               downloadButton(
                                                                                 "final_HOR_table",
                                                                                 label = strong("Download", style = "color: black; border-color: red")
                                                                               ))
                                                            ),
                                                            column(1,align = "center",offset = 0),
                                                            column(
                                                              11,
                                                              align = "center",
                                                              offset = 0,
                                                              conditionalPanel(
                                                                condition = "!output.HOR_table",
                                                                br(),
                                                                br(),
                                                                br(),
                                                                br(),
                                                                br(),
                                                                HTML('<p align="center"><img src="refresh.gif" width= "10%"></p>'),
                                                                br()
                                                              ),
                                                              div(dataTableOutput("HOR_table"),style="text-align: left; font-size: 18px; font-family: Calibri; color: black; margin: 8px; font-weight:100; margin-left:80px"),
                                                            ),
                                                            # column(1,align = "center",offset = 0)
                                                            
                                                              ),
                                                          
                                                          ),
                                         
                                         conditionalPanel(condition="input.PORorHOR == '3'",
                                                          fluidRow(
                                                            column(
                                                              8,
                                                              align = "center",
                                                              offset = 0,
                                                              HTML("
                                                                   <div style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; font-weight:100'>
                                                                   <ul>
                                                                   <li><b>Full List of Available OS Strategies (Both POR and HOR will not appear)</b></li>
                                                                   </ul>
                                                                   </div>
                                                                   "), 
                                                              ),
                                                            column(
                                                              4,
                                                              align="left",
                                                              offset=0,
                                                              conditionalPanel(condition="output.POR_HOR_merge_table",
                                                                               downloadButton(
                                                                                 "final_merge_table",
                                                                                 label = strong("Download", style = "color: black; border-color: red")
                                                                               ))
                                                            ),
                                                            column(1,align = "center",offset = 0),
                                                            column(
                                                              11,
                                                              align = "center",
                                                              offset = 0,
                                                              conditionalPanel(
                                                                condition = "!output.POR_HOR_merge_table",
                                                                br(),
                                                                br(),
                                                                br(),
                                                                br(),
                                                                br(),
                                                                HTML('<p align="center"><img src="refresh.gif" width= "10%"></p>'),
                                                                br()
                                                              ),
                                                              div(dataTableOutput("POR_HOR_merge_table"),style="text-align: left; font-size: 18px; font-family: Calibri; color: black; margin: 8px; font-weight:100; margin-left:80px"),
                                                            ),
                                                            # column(1,align = "center",offset = 0)
                                                            
                                                              ),
                                                          
                                                          ),
                                         
                                         
                                         
                                         ),
                        
                        conditionalPanel(condition="input.mission_type == '2' && input.start_strategy",
                                         htmlOutput("strategy_result")
                                         ),
                        
                        conditionalPanel(condition = "input.start_strategy",
                                         fluidRow(
                                           column(
                                             12,
                                             align = "center",
                                             offset = 0,
                                             
                                             actionButton(
                                               'back_2to1',
                                               strong('BACK'),
                                               class = "btn-red",
                                               style = "font-size: 22px;padding-left:20px;padding-right:20px;margin-bottom:-5px"
                                             ),
                                             
                                             
                                             tags$style(
                                               type = 'text/css',
                                               "#button { vertical-align: middle; height: 50px; width: 100%; font-size: 30px;}"
                                             )
                                           )
                                           
                                         ),
                                         )
                        
                        
                        
                        
                    )
                    
                  )
                        )
                        ),
              
              #******************************************************************************************************
              ### ========================================  Step 2 END=================================================
              #******************************************************************************************************
              
              
              
              #****************************************************************************************************
              ### ========================================  Step 3 Start  =========================================
              #****************************************************************************************************

              
              #****************************************************************************************************
              ### ========================================  Step 3 END===========================================
              #****************************************************************************************************
              
              


              
              

                ),
            
            
            
            tabPanel(
              "Contact Us",
              
              #*********************************************************************************************************
              ### ========================================  Contact Us Panel START  ====================================
              #*********************************************************************************************************
              
              
              div(
                class = "panel-default",
                div(class="panel-heading"),
                div(class="panel-body",
                    div(class="panel-title-blue", 
                        HTML("
                             <p align='center' style='font-family:Calibri;font-size:30px;'><img src='zju_logo.png' width='14%' style='vertical-align:bottom;margin-top:10px; margin-right:50px'><img src='zju_womanhospital_logo.png' width='15%' style='vertical-align:bottom;margin-top:10px;margin-left:50px'></p>
                             ")),
                    
                    tags$ul(
                      # HTML("
                      #      <p align='center' style='font-family:Calibri;font-size:30px;'><img src='contact_logo.png' width='10%' style='vertical-align:bottom;'> @ <a href='http://www.zju.edu.cn/english/' style='color:#2571B3;' target='view_window'><b>ZJU</b></a></p>
                      #      <p style='font-family:Calibri;font-size: 25px;text-align:center;'>Please feel free to visit our website at <a href='https://idrblab.org' style='color:#2571B3;' target='view_window;'><i><strong>https://idrblab.org</strong></i></a></p>
                      #      <p style='font-family:Calibri;font-size: 25px;text-align:center;'>PI's publication list is provided in <a href='https://idrblab.org/Publication.php' style='color:#2571B3;' target='view_window;'><i><strong>Publication Page</strong></i></a> and <a href='https://scholar.google.com.hk/citations?user=hsJDZgYAAAAJ&hl=zh-CN' style='color:#2571B3;' target='view_window;'><i><strong>Google Scholar</strong></i></a></p>
                      #      
                      #      "),
                      HTML("
                           
                           <p style='font-family:Calibri;font-size: 25px;text-align:center;'>Please feel free to visit our website at <a href='https://zju.womanhospital.cn/' target='view_window;'><i><strong>https://zju.womanhospital.cn/</strong></i></a></p>
                           
                           "),
                      
                      hr(style="padding: 0;
                         border: none;
                         height: 1px;
                         background-image: -webkit-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0));
                         background-image: -moz-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0));
                         background-image: -ms-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0));
                         background-image: -o-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0));
                         color: #333;
                         text-align: center;"),
                      fluidRow(
                        column(4,HTML('<p align="center"><img src="contact_2.png" width="50%"></p>
                                      <p style="font-size:22px;color:#c23248;text-align:center;"><b>Email</b></p>'),
                               column(12,
                                      p(strong("Dr. Guiquan Wang"), "(gqwang27@zju.edu.cn)"),
                                      (HTML('<p><b>Prof. Yimin Zhu*</b> (zhuyim@zju.edu.cn)</p>'))
                                      ,style="font-family:Calibri;font-size:20px;text-align:center;")),
                      

                        
                        column(4, HTML('<p align="center"><img src="contact_5.png" width="50%"></p>
                                       <p style="font-size: 22px;color:#c23248;text-align:center;"><b>Address</b></p>'),
                               # column(12, p("College of Pharmaceutical Sciences,"),
                               #        p("Zhejiang University,"),
                               #        p("Hangzhou, China"),
                               #        p("Postal Code: 310058"), style="font-family:Calibri;font-size:20px;text-align:center;"),
                               column(12, p("Women's Hospital,"),
                                      p("School of Medicine,"),
                                      p("Zhejiang University,"),
                                      p("China"),
                                      p("Postal Code: 310003"), style="font-family:Calibri;font-size:20px;text-align:center;")
                               
                        ),
                        
                        
                        # column(3,HTML('<p align="center"><img src="contact_3.png" width="50%"></p>
                        #               <p style="font-size: 22px;color:#F6A24D;text-align:center;"><b>Phone/Fax</b></p>'),
                        #        column(12,"+86-571-8820-8444",style="font-family:Calibri;font-size:20px;text-align:center;"))
                        column(4,HTML('<p align="center"><img src="contact_3.png" width="50%"></p>
                                      <p style="font-size: 22px;color:#c23248;text-align:center;"><b>Phone/Fax</b></p>'),
                               column(12,"+86-15216708175",style="font-family:Calibri;font-size:20px;text-align:center;"),
                               column(12,"+86-0571-87088156",style="font-family:Calibri;font-size:20px;text-align:center;"))
                        
                        ))
                    
                    
                        ),
                
                
                
                    )
              #*********************************************************************************************************
              ### ========================================  Contact Us Panel END  ======================================
              #*********************************************************************************************************
              
                    )
            
                      ),style = "padding-bottom:100px;background-color: white;" ),
        
        
        style = "min-height:100%;")
      
      
      
                      ))
  
  }