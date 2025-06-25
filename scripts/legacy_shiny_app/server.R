library(shiny)
library(shinyjs)
library(shinyalert)
library(shinyWidgets)
library(tidymodels)
library(xgboost)

options(shiny.sanitize.errors = FALSE)
options(shiny.reactlog = TRUE)
options(rgl.useNULL = TRUE,
        shiny.maxRequestSize = 150 * 1024 ^ 2)



shinyServer(function(input, output, session) {
  
  # output$debug <- renderPrint({
  #   dim(raw_data())
  # })
  #****************************************************************************************************
  ### ****** Step 1: Read user-input and store as tibble ****** START =================================
  #****************************************************************************************************
  
  ## *** Step 1: shiny action observer part ********************************************************************************

  # home: pre-set the home path
  home <- reactive({
    return("/srv/shiny-server/ovarianresp")
  })
  
  observeEvent(input$try_example,{
    if (input$try_example == TRUE) {
      
      if (input$PORorHOR == '3') {
        
        # General indicators
        updateNumericInput(
          session = session, inputId = "Age", value = 38
        )
        updateNumericInput(
          session = session, inputId = "Duration", value = 3
        )
        updateNumericInput(
          session = session, inputId = "Weight", value = 50
        )
        updateNumericInput(
          session = session, inputId = "FSH", value = 16
        )
        updateNumericInput(
          session = session, inputId = "LH", value = 12
        )
        updateNumericInput(
          session = session, inputId = "AMH", value = 0.81
        )
        updateNumericInput(
          session = session, inputId = "AFC", value = 5
        )
        updateAwesomeRadio(
          session = session, inputId = "POIorDOR", selected = 1
        )
        
        # POR required indicators
        updateNumericInput(
          session = session, inputId = "DBP", value = 80
        )
        updateNumericInput(
          session = session, inputId = "WBC", value = 6.5
        )
        updateNumericInput(
          session = session, inputId = "RBC", value = 4.3
        )
        updateNumericInput(
          session = session, inputId = "ALT", value = 25
        )
        updateNumericInput(
          session = session, inputId = "P", value = 1.1
        )
        
        # HOR required indicators
        updateNumericInput(
          session = session, inputId = "PLT", value = 220
        )
        updateAwesomeRadio(
          session = session, inputId = "PCOS", selected = 2
        )
      } else if (input$PORorHOR == '2') {
        # General indicators
        updateNumericInput(
          session = session, inputId = "Age", value = 38
        )
        updateNumericInput(
          session = session, inputId = "Duration", value = 3
        )
        updateNumericInput(
          session = session, inputId = "Weight", value = 50
        )
        updateNumericInput(
          session = session, inputId = "FSH", value = 16
        )
        updateNumericInput(
          session = session, inputId = "LH", value = 12
        )
        updateNumericInput(
          session = session, inputId = "AMH", value = 0.81
        )
        updateNumericInput(
          session = session, inputId = "AFC", value = 5
        )
        updateAwesomeRadio(
          session = session, inputId = "POIorDOR", selected = 1
        )
        
        # HOR required indicators
        updateNumericInput(
          session = session, inputId = "PLT", value = 220
        )
        updateAwesomeRadio(
          session = session, inputId = "PCOS", selected = 2
        )
      } else if (input$PORorHOR == '1') {
        # General indicators
        updateNumericInput(
          session = session, inputId = "Age", value = 38
        )
        updateNumericInput(
          session = session, inputId = "Duration", value = 3
        )
        updateNumericInput(
          session = session, inputId = "Weight", value = 50
        )
        updateNumericInput(
          session = session, inputId = "FSH", value = 16
        )
        updateNumericInput(
          session = session, inputId = "LH", value = 12
        )
        updateNumericInput(
          session = session, inputId = "AMH", value = 0.81
        )
        updateNumericInput(
          session = session, inputId = "AFC", value = 5
        )
        updateAwesomeRadio(
          session = session, inputId = "POIorDOR", selected = 1
        )
        
        # POR required indicators
        updateNumericInput(
          session = session, inputId = "DBP", value = 80
        )
        updateNumericInput(
          session = session, inputId = "WBC", value = 6.5
        )
        updateNumericInput(
          session = session, inputId = "RBC", value = 4.3
        )
        updateNumericInput(
          session = session, inputId = "ALT", value = 25
        )
        updateNumericInput(
          session = session, inputId = "P", value = 1.1
        )
      }
      
      
    }
  })
  
  
  observeEvent(input$try_example, {
    if (input$try_example == FALSE) {
      
      # General indicators
      reset("Age")
      reset("Duration")
      reset("Weight")
      reset("FSH")
      reset("LH")
      reset("AMH")
      reset("AFC")
      reset("DBP")
      reset("WBC")
      reset("RBC")
      reset("ALT")
      reset("P")
      reset("PLT")
      reset("PCOS")
      reset("POIorDOR")
      
    }
  })
  
  
  
  observeEvent(input$start, {

    if (is.na(input$Age + input$Duration + input$Weight + input$FSH + input$LH + input$AMH + input$AFC + input$DBP + as.numeric(input$POIorDOR) + input$WBC + input$RBC + input$ALT + input$P) && is.na(input$Age + input$Duration + input$Weight + input$FSH + input$LH + input$AMH + input$AFC + as.numeric(input$POIorDOR)+ input$PLT + as.numeric(input$PCOS))) {
      # shinyalert("Sorry", "The mission ID you queried does not exist, please verify your mission ID and retry. You can also resubmit a new mission.",closeOnEsc = TRUE,closeOnClickOutside = FALSE, html = FALSE, showCancelButton = FALSE,showConfirmButton = TRUE)
      sendSweetAlert(
        session = session,
        title = "Sorry...",
        text = "The required indicators have not yet been completed, please try again after completing them.",
        type = "error"
      )
      print("Error")
    } else {
      shinyjs::hide("st1")
      shinyjs::show("st2")
    }
  })
  
  ## *** Step 1: Main coding part *********************************************************************************************

  
  #****************************************************************************************************
  ### ****** Step 1: Read user-input and store as tibble ****** START =================================
  #****************************************************************************************************

  indicator4Predict <- reactive({
    # General indicators
    Age <- input$Age
    Duration <- input$Duration
    Weight <- input$Weight
    FSH <- input$FSH
    LH <- input$LH
    AMH <- input$AMH
    AFC <- input$AFC
    if (as.numeric(input$POIorDOR) == 1) {POIorDOR <- factor(c("Yes", "No"))[1]} else {POIorDOR <- factor(c("Yes", "No"))[2]}
    
    # POR required indicators
    DBP <- input$DBP
    WBC <- input$WBC
    RBC <- input$RBC
    ALT <- input$ALT
    P <- input$P
    
    # HOR required indicators
    PLT <- input$PLT
    if (as.numeric(input$PCOS) == 1) {PCOS <- factor(c("Yes", "No"))[1]} else {PCOS <- factor(c("Yes", "No"))[2]}
    

    indicator4Predict <- as.data.frame(cbind(Age, Duration, Weight, FSH, LH, AMH, AFC, POIorDOR, DBP, WBC, RBC, ALT, P, PLT, PCOS))
    indicator4Predict$POIorDOR <- POIorDOR
    indicator4Predict$PCOS <- PCOS
    return(indicator4Predict)
  })
  
  # indicator4HOR <- reactive({
  #   # General indicators
  #   Age <- input$Age
  #   Duration <- input$Duration
  #   Weight <- input$Weight
  #   FSH <- input$FSH
  #   LH <- input$LH
  #   AMH <- input$AMH
  #   AFC <- input$AFC
  #   if (as.numeric(input$POIorDOR) == 1) {POIorDOR <- factor(c("Yes", "No"))[1]} else {POIorDOR <- factor(c("Yes", "No"))[2]}
  # 
  #   
  #   # HOR required indicators
  #   PLT <- input$PLT
  #   if (as.numeric(input$PCOS) == 1) {PCOS <- factor(c("Yes", "No"))[1]} else {PCOS <- factor(c("Yes", "No"))[2]}
  #   
  #   indicator4HOR <- as.data.frame(cbind(Age, Duration,Weight, FSH, LH, AMH, AFC, POIorDOR, PLT, PCOS))
  #   
  #   indicator4HOR$POIorDOR <- POIorDOR
  #   indicator4HOR$PCOS <- PCOS
  #   return(indicator4HOR)
  # })
  
  
  
  #****************************************************************************************************
  ### ****** Step 2: Diagnosing POR & HOR ********************* START =================================
  #****************************************************************************************************
  
  ## *** Step 2: shiny action observer part ************************************************************************
  observeEvent(input$start_strategy, {
    shinyjs::hide("start_strategy")
  })
  
  observeEvent(input$back_2to1, {
    shinyjs::hide("st2")
    shinyjs::show("st1")
    reset("start")
    reset("start_strategy")
  })
  # 
  # observeEvent(input$next_2to3, {
  #   shinyjs::hide("st2")
  #   shinyjs::show("st3")
  # })
  
  
  ## *** Step 2: Main coding part **********************************************************************************
  
  
  #****************************************************************************************************
  ### ****** Step 2: Diagnosing POR & HOR ********************* END ===================================
  #****************************************************************************************************
  
  Diagnosing_POR <- reactive({
    if (!is.na(indicator4Predict())){
      setwd(home())
      load("./forshiny.RData")
      new_person <- indicator4Predict()
      Diagnosing_POR <- predict(pordm_final_wfversion, new_person, type = "prob")
    } else {Diagnosing_POR <- NULL}
    return(Diagnosing_POR)
  })
  
  Diagnosing_HOR <- reactive({
    if (!is.na(indicator4Predict())) {
      setwd(home())
      load("./forshiny.RData")
      new_person <- indicator4Predict()
      Diagnosing_HOR <- predict(hordm_final_wfversion, new_person, type = "prob")
    } else {Diagnosing_HOR <- NULL}
    return(Diagnosing_HOR)
  })
  
  output$Diagnosing_result <- renderUI({
    if (!is.na(Diagnosing_HOR())) {
      
      if (input$PORorHOR == '3') {
        Diagnosing_POR <- Diagnosing_POR()
        if (as.numeric(Diagnosing_POR[1,1]) > as.numeric(Diagnosing_POR[1,2])) {POR_result <- substr(names(Diagnosing_POR)[1],7,10)} else {POR_result <- substr(names(Diagnosing_POR)[2],7,10)}
        
        Diagnosing_HOR <- Diagnosing_HOR()
        if (as.numeric(Diagnosing_HOR[1,1]) > as.numeric(Diagnosing_HOR[1,2])) {HOR_result <- substr(names(Diagnosing_HOR)[1],7,10)} else {HOR_result <- substr(names(Diagnosing_HOR)[2],7,10)}
        
        Diagnosing_result <-
          paste0(
            "<p style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px'>",
            "The results of POR and HOR predictions are as following:",
            "</p>",
            "<div style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; margin-bottom:20px'>",
            "<ul>",
            "<li>Predicted POR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", POR_result,"</font></li>",
            "<li>Predicted risk of POR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", substr(names(Diagnosing_POR)[1],7,10), " (", round(as.numeric(Diagnosing_POR[1,1]), 3), "), ", substr(names(Diagnosing_POR)[2],7,10), " (", round(as.numeric(Diagnosing_POR[1,2]), 3), ")","</font></li>",
            "<li>Predicted HOR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", HOR_result,"</font></li>",
            "<li>Predicted risk of HOR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", substr(names(Diagnosing_HOR)[1],7,10), " (", round(as.numeric(Diagnosing_HOR[1,1]), 3), "), ", substr(names(Diagnosing_HOR)[2],7,10), " (", round(as.numeric(Diagnosing_HOR[1,2]), 3), ")","</font></li>",
            "</ul>",
            "</div>"
          )
      } else if (input$PORorHOR == '2') {
        Diagnosing_HOR <- Diagnosing_HOR()
        if (as.numeric(Diagnosing_HOR[1,1]) > as.numeric(Diagnosing_HOR[1,2])) {HOR_result <- substr(names(Diagnosing_HOR)[1],7,10)} else {HOR_result <- substr(names(Diagnosing_HOR)[2],7,10)}
        
        Diagnosing_result <-
          paste0(
            "<p style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px'>",
            "The results of POR and HOR predictions are as following:",
            "</p>",
            "<div style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; margin-bottom:20px'>",
            "<ul>",
            "<li>Predicted HOR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", HOR_result,"</font></li>",
            "<li>Predicted risk of HOR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", substr(names(Diagnosing_HOR)[1],7,10), " (", round(as.numeric(Diagnosing_HOR[1,1]), 3), "), ", substr(names(Diagnosing_HOR)[2],7,10), " (", round(as.numeric(Diagnosing_HOR[1,2]), 3), ")","</font></li>",
            "</ul>",
            "</div>"
          )
      } else if (input$PORorHOR == '1') {
        Diagnosing_POR <- Diagnosing_POR()
        if (as.numeric(Diagnosing_POR[1,1]) > as.numeric(Diagnosing_POR[1,2])) {POR_result <- substr(names(Diagnosing_POR)[1],7,10)} else {POR_result <- substr(names(Diagnosing_POR)[2],7,10)}
        
        Diagnosing_result <-
          paste0(
            "<p style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px'>",
            "The results of POR and HOR predictions are as following:",
            "</p>",
            "<div style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; margin-bottom:20px'>",
            "<ul>",
            "<li>Predicted POR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", POR_result,"</font></li>",
            "<li>Predicted risk of POR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", substr(names(Diagnosing_POR)[1],7,10), " (", round(as.numeric(Diagnosing_POR[1,1]), 3), "), ", substr(names(Diagnosing_POR)[2],7,10), " (", round(as.numeric(Diagnosing_POR[1,2]), 3), ")","</font></li>",
            "</ul>",
            "</div>"
          )
      }
      
      HTML(paste(Diagnosing_result, sep = ''))
    } else {return(NULL)}

    
    
  })
  
  # output$strategy_notice1 <- renderUI({
  #   if (!is.na(Diagnosing_HOR())) {
  #     
  #     strategy_notice <-
  #       paste0(
  #         
  #         "<div style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; font-weight:100'>",
  #         "<p style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; font-weight:100'>",
  #         "The default states of POR & HOR below were preset to the POR & HOR prediction results of your input: ",
  #         "</p>",
  #         "<ul>",
  #         "<li>If you need 'Suggested Ovarian Stimulation Strategies' prediction, please modified the states of POR & HOR</li>",
  #         "<li></li>",
  #         "</ul>",
  #         "</div>"
  #       )
  #     HTML(paste(strategy_notice, sep = ''))
  #   } else {return(NULL)}
  #   
  #   
  #   
  # })
  
  output$strategy_notice2 <- renderUI({
    if (!is.na(Diagnosing_HOR())) {

      strategy_notice <-
        paste0(

          "<div style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; font-weight:100'>",
          "<p style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; font-weight:100'>",
          "Please select your preferred method and start deploying individualized OS strategies: ",
          "</p>",
          "<ul>",
          "<li><b>Full Scaning</b>: Scan all available OS strategies using which POR and/or HOR will not appear</li>",
          "<li><b>Specific Testing</b>: Test a specific OS strategy and check the prediction results of POR and HOR</li>",
          "</ul>",
          "</div>"
        )
      HTML(paste(strategy_notice, sep = ''))
    } else {return(NULL)}
    
    
    
  })
  
  
  
  #****************************************************************************************************
  ### ****** Step 3: Suggested Ovarian Stimulation strategies  ****** START ===========================
  #****************************************************************************************************
  
  
  ## *** Step 3: shiny action observer part ************************************************************************
  
  observeEvent(input$Protocol,{
    if (input$Protocol == 1) {
      shinyjs::enable("Initial.FSH")
      shinyjs::enable("Recombinant")
      shinyjs::enable("Use.LH")
      
      shinyjs::reset("Initial.FSH")
      shinyjs::reset("Recombinant")
      shinyjs::reset("Use.LH")
    }
  })
  
  observeEvent(input$Protocol,{
    if (input$Protocol == 2) {
      shinyjs::enable("Initial.FSH")
      shinyjs::enable("Recombinant")
      shinyjs::enable("Use.LH")
      
      shinyjs::reset("Initial.FSH")
      shinyjs::reset("Recombinant")
      shinyjs::reset("Use.LH")
    }
  })
  observeEvent(input$Protocol,{
    if (input$Protocol == 3) {
      shinyjs::enable("Initial.FSH")
      shinyjs::enable("Recombinant")
      shinyjs::enable("Use.LH")
      
      shinyjs::reset("Initial.FSH")
      shinyjs::reset("Recombinant")
      shinyjs::reset("Use.LH")
    }
  })
  observeEvent(input$Protocol,{
    if (input$Protocol == 4) {
      shinyjs::enable("Initial.FSH")
      shinyjs::enable("Recombinant")
      shinyjs::enable("Use.LH")
      
      shinyjs::reset("Initial.FSH")
      shinyjs::reset("Recombinant")
      shinyjs::reset("Use.LH")
    }
  })
  
  # observeEvent(input$start_strategy,{
  #   
  #   shinyjs::disable("Protocol")
  #   shinyjs::disable("Initial.FSH")
  #   shinyjs::disable("Recombinant")
  #   shinyjs::disable("Use.LH")
  #   
  #   
  # })
  
  observeEvent(input$Protocol,{
    if (input$Protocol == 5) {
      updateSelectInput(
        session = session, inputId = "Initial.FSH", selected = 6
      )
      shinyjs::disable("Initial.FSH")
      updateSelectInput(
        session = session, inputId = "Recombinant", selected = 3
      )
      shinyjs::disable("Recombinant")
      updateSelectInput(
        session = session, inputId = "Use.LH", selected = 3
      )
      shinyjs::disable("Use.LH")
    }
  })
  
  observeEvent(input$Protocol,{
    if (input$Protocol == 6) {
      updateSelectInput(
        session = session, inputId = "Initial.FSH", selected = 6
      )
      shinyjs::disable("Initial.FSH")
      updateSelectInput(
        session = session, inputId = "Recombinant", selected = 3
      )
      shinyjs::disable("Recombinant")
      updateSelectInput(
        session = session, inputId = "Use.LH", selected = 3
      )
      shinyjs::disable("Use.LH")
    }
  })
  
  observeEvent(input$Protocol,{
    if (input$Protocol == 7) {
      updateSelectInput(
        session = session, inputId = "Initial.FSH", selected = 6
      )
      shinyjs::disable("Initial.FSH")
      updateSelectInput(
        session = session, inputId = "Recombinant", selected = 3
      )
      shinyjs::disable("Recombinant")
      updateSelectInput(
        session = session, inputId = "Use.LH", selected = 3
      )
      shinyjs::disable("Use.LH")
    }
  })
  
  
  
  ## *** Step 3: Main coding part **********************************************************************************
  
  #****************************************************************************************
  #*************************** A. Scan All strategies  ************************************
  #****************************************************************************************
  
  scan_result <- reactive({
    if ((!is.na(indicator4Predict())) && input$mission_type == 1) {
      all_strategies <- data.frame(Protocol=factor(c("Long","Ultra-long","Short","Antagonist","Mild or Natural","PPOS","Other protocol"))[0], Initial.FSH=factor(c("A","B","C","D","E","None"))[0], Recombinant=factor(c("Yes", "No","None"))[0], Use.LH=factor(c("Yes", "No","None"))[0])
      Protocol <- factor(c("Long","Ultra-long","Short","Antagonist","Mild or Natural","PPOS","Other protocol"))[1:4]
      Initial.FSH <- factor(c("A","B","C","D","E","None"))[1:5]
      Recombinant <- factor(c("Yes", "No","None"))[1:2]
      Use.LH <- factor(c("Yes", "No","None"))[1:2]
      # all_strategies <- NULL
      count <- 0
      for(i in 1:length(Protocol)) {
        Protocol_temp <- Protocol[i]
        for(j in 1:length(Initial.FSH)) {
          Initial.FSH_temp <- Initial.FSH[j]
          for(k in 1:length(Recombinant)) {
            Recombinant_temp <- Recombinant[k]
            for (l in 1:length(Use.LH)) {
              Use.LH_temp <- Use.LH[l]
              count <- count + 1
              # strategy_temp <- c(Protocol_temp, Initial.FSH_temp, Recombinant_temp, Use.LH_temp)
              all_strategies[count, 1] <- Protocol_temp
              all_strategies[count, 2] <- Initial.FSH_temp
              all_strategies[count, 3] <- Recombinant_temp
              all_strategies[count, 4] <- Use.LH_temp
            }
          }
        }
      }
      all_strategies[81, 1] <- factor(c("Long","Ultra-long","Short","Antagonist","Mild or Natural","PPOS","Other protocol"))[5]
      all_strategies[81,2] <- factor(c("A","B","C","D","E","None"))[6]
      all_strategies[81,3] <- factor(c("Yes", "No","None"))[3]
      all_strategies[81,4] <- factor(c("Yes", "No","None"))[3]
      
      all_strategies[82, 1] <- factor(c("Long","Ultra-long","Short","Antagonist","Mild or Natural","PPOS","Other protocol"))[6]
      all_strategies[82,2] <- factor(c("A","B","C","D","E","None"))[6]
      all_strategies[82,3] <- factor(c("Yes", "No","None"))[3]
      all_strategies[82,4] <- factor(c("Yes", "No","None"))[3]
      
      all_strategies[83, 1] <- factor(c("Long","Ultra-long","Short","Antagonist","Mild or Natural","PPOS","Other protocol"))[7]
      all_strategies[83,2] <- factor(c("A","B","C","D","E","None"))[6]
      all_strategies[83,3] <- factor(c("Yes", "No","None"))[3]
      all_strategies[83,4] <- factor(c("Yes", "No","None"))[3]
      
      
      baseline_indicators <- indicator4Predict()
      setwd(home())
      load("./forshiny.RData")
      
      all_POR_strategies <- NULL
      all_HOR_strategies <- NULL

      for (i in 1:nrow(all_strategies)) {
        all_indicators <- cbind(baseline_indicators, all_strategies[i,])
        
        POR_pre <- predict(porsm_final_wfversion, all_indicators, type = "prob")
        if (as.numeric(POR_pre)[1]>as.numeric(POR_pre)[2]) {
          NO_Possibility_POR <- round(as.numeric(POR_pre)[1],4)
          all_strategies_prob <- cbind(all_strategies[i,], NO_Possibility_POR)
          all_POR_strategies <- rbind(all_POR_strategies, all_strategies_prob)
        }
        
        HOR_pre <- predict(horsm_final_wfversion, all_indicators, type = "prob")
        if (as.numeric(HOR_pre)[1]>as.numeric(HOR_pre)[2]) {
          NO_Possibility_HOR <- round(as.numeric(HOR_pre)[1],4)
          all_strategies_prob <- cbind(all_strategies[i,], NO_Possibility_HOR)
          all_HOR_strategies <- rbind(all_HOR_strategies, all_strategies_prob)
        }
      }
      
      FSH_factor <- factor(c("A","B","C","D","E","None"))
      FSH_char <- c("225 IU", "<=100 IU", "150 IU", "200 IU", ">=300 IU", "Neither agonist or antagonist protocol")
      
      for (i in 1:length(FSH_factor)) {
        all_POR_strategies$Initial.FSH <- gsub(FSH_factor[i],FSH_char[i],all_POR_strategies$Initial.FSH)
        all_HOR_strategies$Initial.FSH <- gsub(FSH_factor[i],FSH_char[i],all_HOR_strategies$Initial.FSH)
      }
      
      scan_result <- list()
      scan_result[[1]] <- all_POR_strategies
      scan_result[[2]] <- all_HOR_strategies
      return(scan_result)
    } else {return(NULL)}
    # all_strategies <- as.data.frame(cbind(Protacol, Initial.FSH, Recombinant, Use.LH))

  })
  
  final_POR_table <- reactive({
    if (!is.null(scan_result())) {
      POR_table <- scan_result()[[1]]
      POR_table <- POR_table[sort(POR_table$NO_Possibility_POR,index.return=TRUE,decreasing = TRUE)$ix,]

      rownames(POR_table) <- seq(1,nrow(POR_table),1)
      
      colnames(POR_table) <- c("Ovarian stimulation protocol", "Starting dose of FSH", "Using rFSH", "Using LH", "Probability of Non-POR")
      return(POR_table)
    } else {return(NULL)}
    
  })
  
  output$POR_table <- renderDataTable({
    if (!is.null(final_POR_table())) {
      output$final_POR_table <- downloadHandler(
        filename = function() {
          "Top_10_Suggested_Ovarian_Stimulation_Strategies_POR.csv"
        },
        content  = function(file) {
          write.csv(final_POR_table(), file, row.names = FALSE, fileEncoding = "UTF-8")
        }
      )
      datatable(final_POR_table(), options = list(lengthMenu = c(5, 10, 20), pageLength = 5))
    } else {return(NULL)}
  })
  
  final_HOR_table <- reactive({
    if (!is.null(scan_result())) {
      HOR_table <- scan_result()[[2]]
      HOR_table <- HOR_table[sort(HOR_table$NO_Possibility_HOR,index.return=TRUE,decreasing = TRUE)$ix,]
      rownames(HOR_table) <- seq(1,nrow(HOR_table),1)
      colnames(HOR_table) <- c("Ovarian stimulation protocol", "Starting dose of FSH", "Using rFSH", "Using LH", "Probability of Non-HOR")
      return(HOR_table)
    } else {return(NULL)}
    
  })
  
  output$HOR_table <- renderDataTable({
    if (!is.null(final_HOR_table())) {
      output$final_HOR_table <- downloadHandler(
        filename = function() {
          "Top_10_Suggested_Ovarian_Stimulation_Strategies_HOR.csv"
        },
        content  = function(file) {
          write.csv(final_HOR_table(), file, row.names = FALSE, fileEncoding = "UTF-8")
        }
      )
      datatable(final_HOR_table(), options = list(lengthMenu = c(5, 10, 20), pageLength = 5))
    } else {return(NULL)}
  })
  
  final_merge_table <- reactive({
    if (!is.null(scan_result())) {
      POR_table <- scan_result()[[1]]
      HOR_table <- scan_result()[[2]]
      
      # POR_table <- POR_table[sort(POR_table$NO_Possibility_POR,index.return=TRUE,decreasing = TRUE)$ix,]
      # HOR_table <- HOR_table[sort(HOR_table$NO_Possibility_HOR,index.return=TRUE,decreasing = TRUE)$ix,]
      # if (nrow(POR_table) > 20) {
      #   POR_table <- POR_table[1:20,]
      # }
      # if (nrow(HOR_table) > 20) {
      #   HOR_table <- HOR_table[1:20,]
      # }
      merge_table <- merge(POR_table, HOR_table, by.y = c("Protocol", "Initial.FSH", "Recombinant", "Use.LH"))
      merge_table$total_prob <- merge_table$NO_Possibility_POR + merge_table$NO_Possibility_HOR
      merge_table <- merge_table[sort(merge_table$total_prob,index.return=TRUE,decreasing = TRUE)$ix,][,-ncol(merge_table)]
      colnames(merge_table) <- c("Ovarian stimulation protocol", "Starting dose of FSH", "Using rFSH", "Using LH", "Probability of Non-POR", "Probability of Non-HOR")
      rownames(merge_table) <- seq(1,nrow(merge_table),1)
      return(merge_table)
    } else {return(NULL)}
    
  })
  
  output$POR_HOR_merge_table <- renderDataTable({
    if (!is.null(final_merge_table())) {
      output$final_merge_table <- downloadHandler(
        filename = function() {
          "Top_10_Suggested_Ovarian_Stimulation_Strategies_POR_and_HOR.csv"
        },
        content  = function(file) {
          write.csv(final_merge_table(), file, row.names = FALSE, fileEncoding = "UTF-8")
        }
      )
      datatable(final_merge_table(), options = list(lengthMenu = c(5, 10, 20), pageLength = 5))
    } else {return(NULL)}
  })
  

  #****************************************************************************************
  #*************************** B. Specific Strategy  **************************************
  #****************************************************************************************
  
  specific_strategy <- reactive({
    if ((!is.na(Diagnosing_HOR())) && input$mission_type == 2) {
      specific_strategy <- list()
      setwd(home())
      load("./forshiny.RData")
      baseline_indicator <- indicator4Predict()
      
      Protocol <- factor(c("Long","Ultra-long","Short","Antagonist","Mild or Natural","PPOS","Other protocol"))[as.numeric(input$Protocol)]
      Initial.FSH <- factor(c("A","B","C","D","E","None"))[as.numeric(input$Initial.FSH)]
      Recombinant <- factor(c("Yes", "No","None"))[as.numeric(input$Recombinant)]
      Use.LH <- factor(c("Yes", "No","None"))[as.numeric(input$Use.LH)]
      
      new_person <- cbind(baseline_indicator, Protocol, Initial.FSH, Recombinant, Use.LH)
      
      Diagnosing_POR <- predict(porsm_final_wfversion, new_person, type = "prob")
      Diagnosing_HOR <- predict(horsm_final_wfversion, new_person, type = "prob")
      
      specific_strategy[[1]] <- Diagnosing_POR
      specific_strategy[[2]] <- Diagnosing_HOR
      
      return(specific_strategy)
    } else {return(NULL)}
    
  })
  
  output$strategy_result <- renderUI({
    if ((!is.na(specific_strategy())) && input$mission_type == 2) {

      if (input$PORorHOR == '3') {
        Diagnosing_POR <- specific_strategy()[[1]]
        Diagnosing_HOR <- specific_strategy()[[2]]
        
        
        
        if (as.numeric(Diagnosing_POR[1,1]) > as.numeric(Diagnosing_POR[1,2])) {POR_result <- substr(names(Diagnosing_POR)[1],7,10)} else {POR_result <- substr(names(Diagnosing_POR)[2],7,10)}
        
        if (as.numeric(Diagnosing_HOR[1,1]) > as.numeric(Diagnosing_HOR[1,2])) {HOR_result <- substr(names(Diagnosing_HOR)[1],7,10)} else {HOR_result <- substr(names(Diagnosing_HOR)[2],7,10)}
        
        Diagnosing_result <-
          paste0(
            "<p style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px'>",
            "The results of POR and HOR predictions based on your selected ovarian stimulation strategy are as following:",
            "</p>",
            "<div style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; margin-bottom:20px'>",
            "<ul>",
            "<li>Predicted POR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", POR_result,"</font></li>",
            "<li>Predicted risk of POR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", substr(names(Diagnosing_POR)[1],7,10), " (", round(as.numeric(Diagnosing_POR[1,1]), 3), "), ", substr(names(Diagnosing_POR)[2],7,10), " (", round(as.numeric(Diagnosing_POR[1,2]), 3), ")","</font></li>",
            "<li>Predicted HOR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", HOR_result,"</font></li>",
            "<li>Predicted risk of HOR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", substr(names(Diagnosing_HOR)[1],7,10), " (", round(as.numeric(Diagnosing_HOR[1,1]), 3), "), ", substr(names(Diagnosing_HOR)[2],7,10), " (", round(as.numeric(Diagnosing_HOR[1,2]), 3), ")","</font></li>",
            "</ul>",
            "</div>"
          )
      } else if (input$PORorHOR == '2') {
        Diagnosing_HOR <- specific_strategy()[[2]]
        
        
        if (as.numeric(Diagnosing_HOR[1,1]) > as.numeric(Diagnosing_HOR[1,2])) {HOR_result <- substr(names(Diagnosing_HOR)[1],7,10)} else {HOR_result <- substr(names(Diagnosing_HOR)[2],7,10)}
        
        Diagnosing_result <-
          paste0(
            "<p style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px'>",
            "The results of POR and HOR predictions based on your selected ovarian stimulation strategy are as following:",
            "</p>",
            "<div style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; margin-bottom:20px'>",
            "<ul>",
            "<li>Predicted HOR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", HOR_result,"</font></li>",
            "<li>Predicted risk of HOR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", substr(names(Diagnosing_HOR)[1],7,10), " (", round(as.numeric(Diagnosing_HOR[1,1]), 3), "), ", substr(names(Diagnosing_HOR)[2],7,10), " (", round(as.numeric(Diagnosing_HOR[1,2]), 3), ")","</font></li>",
            "</ul>",
            "</div>"
          )
      } else if (input$PORorHOR == '1') {
        Diagnosing_POR <- specific_strategy()[[1]]
        
        
        
        if (as.numeric(Diagnosing_POR[1,1]) > as.numeric(Diagnosing_POR[1,2])) {POR_result <- substr(names(Diagnosing_POR)[1],7,10)} else {POR_result <- substr(names(Diagnosing_POR)[2],7,10)}
        
        Diagnosing_result <-
          paste0(
            "<p style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px'>",
            "The results of POR and HOR predictions based on your selected ovarian stimulation strategy are as following:",
            "</p>",
            "<div style='text-align: left; font-size: 20px; font-family: Calibri; color: black; margin: 8px; margin-bottom:20px'>",
            "<ul>",
            "<li>Predicted POR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", POR_result,"</font></li>",
            "<li>Predicted risk of POR: <font style='text-left: justify; font-family: Calibri; color: #437A8B; font-weight:bold;'>", substr(names(Diagnosing_POR)[1],7,10), " (", round(as.numeric(Diagnosing_POR[1,1]), 3), "), ", substr(names(Diagnosing_POR)[2],7,10), " (", round(as.numeric(Diagnosing_POR[1,2]), 3), ")","</font></li>",
            "</ul>",
            "</div>"
          )
      }
      
      HTML(paste(Diagnosing_result, sep = ''))
    } else {return(NULL)}
    
    
    
  })
  
  
  #****************************************************************************************************
  ### ****** Step 3: Suggested Ovarian Stimulation strategies  ****** START ===========================
  #****************************************************************************************************
  

})
