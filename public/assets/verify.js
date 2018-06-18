$(document).ready(function(){

  
$('form').on('submit', function(){


      $.ajax({

        type: 'POST',

        url: '/',

        success: function(){

          //do something with the data via front-end framework

          location.reload();

        }

      });


      return false;


  });


}