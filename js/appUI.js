(function(){
   // Global vars
   var $mapCanvas = $('#mapCanvas')
    , $vlt = $('#pfx_volette')

  // TEXTFIELD BLURRING
  $(".textField").focus(function(){
    if ($(this).val() == $(this)[0].title){
        $(this).removeClass("textFieldActive");
        $(this).val("");
    }
  });

  $(".textField").blur(function(){
    if ($(this).val() == ""){
        $(this).addClass("textFieldActive");
        $(this).val($(this)[0].etitle);
    }
  });

  $(".textField").blur();

  
  // Define hover box behavior
  $mapCanvas.mousemove(function(e){
    var xOffset = e.pageX
      , yOffset = e.pageY
      , xBuffer = 10

      , vlt_height = $vlt.height()
      , vlt_width = $vlt.width()

      , mapCanvas_height = $mapCanvas.height()
      , mapCanvas_width = $mapCanvas.width()
    
      , mapCanvas_offsetLeft = $mapCanvas.offset().left
      , mapCanvas_offsetTop = $mapCanvas.offset().top;
    
    // If it goes against the left wall
    if (xOffset < (vlt_width/2) + xBuffer){
      $vlt.css({
        'top': yOffset + 50,
        'left': xBuffer
      });
    // If it goes against the right wall
    }else if(xOffset > mapCanvas_width - vlt_width/2 - xBuffer*4){
      $vlt.css({
        'top': yOffset + 50,
        'left': mapCanvas_width - vlt_width/2 - xBuffer*4 - vlt_width/2
      });
    }else{
      $vlt.css({
        'top': yOffset + 50,
        'left': xOffset - vlt_width/2
      });
    }
    

  }); // End hover box behavior
})();