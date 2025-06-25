$(function() {
  $(document).on({

    'shiny:inputchanged': function(event) {
       if (event.name === 'go1') {
    st1.style.display='none';
    st2.style.display='block';
  }
   if (event.name === 'go2') {
    st1.style.display='none';
    st2.style.display='block';
  }
   
   if (event.name === 'go9') {
    st1.style.display='none';
    st2.style.display='block';
  }
  
   if (event.name === 'go3') {
    st2.style.display='none';
    st3.style.display='block';
  }
   if (event.name === 'go4') {
    st3.style.display='none';
    st4.style.display='block';
  }   
  
    },

    'shiny:message': function(event) {
      console.log('Received a message from Shiny');
      var msg = event.message;
      if (msg.hasOwnProperty('custom') && msg.custom.hasOwnProperty('special')) {
        console.log('This is a special message from Shiny:');
        console.log(msg.custom.special);
      }
    },


    'shiny:error': function(event) {
      if (event.name === 'error_info') {
        event.error.message = 'A nice error occurred :)';
      }
    }



  });

  // when the slider input is bound, add a red border to it
  $('#bins').on('shiny:bound', function(event) {
    $(this).parent().css('border', 'dotted 2px red');
  });

  Shiny.addCustomMessageHandler('special', function(message) {
    //
  });
});