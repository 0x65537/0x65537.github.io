(function (window, Cryptoloji, $, undefined) {
  'use strict'

  //
  // jQuery document ready bootstrap
  //
  $(document).ready(function () {

    // temporaly removed
    // $("body").css("height",$(window).innerHeight())
    // $(".main_content_top").css("height",$(window).innerHeight()/2-$(".main_keyslider").height()/2)
    $(".main_key_modal").css("height",$(window).innerHeight()/2-$(".main_keyslider").height()/2)
    // $(".main_content_bottom").css("height",$(window).innerHeight()/2-$(".main_keyslider").height()/2)
    // $(".main_content_top_label").css("margin-top", $(".header").height())

    //
    // Key selectors filler
    //
    var emoji_list = [ '😹','😤','😐','😖','😀','😻','😕','🙍','😠', ]
    Cryptoloji.UI.fillEncryptionKeyslider(emoji_list)
    Cryptoloji.UI.fillDecryptionKeyslider(emoji_list)
    Cryptoloji.UI.fillKeymodal(emoji_list)

    //
    // Input text size counter
    //
    var maxInputTextSize = 400
    Cryptoloji.UI.encryptionInputCounter(maxInputTextSize)

    //
    // Key modal
    //
    $('body').click(function(event) { 
      if($('body').hasClass('main_key_modal-open') && !$(event.target.closest('.main_key_modal')).is('.main_key_modal')) {
        $('body').removeClass('main_key_modal-open')
      }        
    })

    $('#encryption_key_modal_open').click(function(event){
      event.stopPropagation()
      if ($('body').hasClass('main_key_modal-open')) {
        $('body').removeClass('main_key_modal-open')
      } else {
        $('body').addClass('main_key_modal-open')
      }
    })
  })

  //
  // StateMan bootstrap
  //
  Cryptoloji.stateman.start()
  // go to welcome if no state is active
  if (Cryptoloji.stateman.current.name === '')
    Cryptoloji.stateman.go('welcome')

})(window, window.Cryptoloji, jQuery); 
