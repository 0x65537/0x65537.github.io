(function (window, Cryptoloji, $, twemoji, undefined) {

  /*
    methods prefixed with _ are "private"
    to see exposed method goto bottom :)
  */

  //////////////////////////////////////////////////////////////////////////////
  // private var to store the emoji letter-set used to encyption animation
  var _emojiLetterSet = {'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭', 'i': '🇮', 'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷', 's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿',
                         '0': '0⃣', '1': '1⃣', '2': '2⃣', '3': '3⃣', '4': '4⃣', '5': '5⃣', '6': '6⃣', '7': '7⃣', '8': '8⃣', '9': '9⃣',
                         'symbol': '🔣'}
  //
  // public methods
  //

  function decryptText () {
    var text = $('#decryption_input').attr('text')
    Cryptoloji.current.input = text

    console.debug('Chosen text:', Cryptoloji.current.input)
    text = CryptoLib.decrypt(Cryptoloji.current.input, Cryptoloji.current.key)
    console.debug('Decrypted text:', text)
    Cryptoloji.current.output = text
    $('#decryption_output').removeClass('placeholdit').text(text)
    Cryptoloji.stateman.emit('decrypt:show-reply')
  }

  function encryptText () {
    if (Cryptoloji.current.key) {
      var text = $('#encryption_input').val()
      if (text !== '' && !/^\s+$/.test(text)) {
        CryptoLib.generateEmojiSubsetFrom(Cryptoloji.current.key)
        Cryptoloji.current.input = text
        Cryptoloji.stateman.emit('encrypt:hide-output-placeholder')
        console.debug('Chosen text:', text)
        text = CryptoLib.encrypt(Cryptoloji.current.input, Cryptoloji.current.key)
        console.debug('Encrypted text:', text)
        Cryptoloji.current.output = text
        encryptTextAnimation(Cryptoloji.current.input, text)
        // text = toTwemoji(text)
        // $('#encryption_output').html(text)
        // $('.share_message_item').html(text)
        // Cryptoloji.stateman.emit('encrypt:show-share')
      }
    }
  }

  function encryptTextAnimation (text, emojiText) {
    console.log(text, emojiText)
    text = text.toLowerCase()
    var letterEmoji = _.map(text, function (c) {
      // escape space or newline
      if (c === '\n' || c === ' ') return c

      // remap 'strange' characters
      var pointC = punycode.ucs2.decode(c)[0]
      // a <- à 0ca 224 á 1ca 225 â 2ca 226 ã 3ca 227 ä 4ca 228 å 5ca 229 æ 6ca 230
      if (pointC >= 224 && pointC <= 230) c = 'a'
      // c <- ç 7ca 231
      else if (pointC === 231) c = 'c'
      // d <- ð hda 240 þ vda 254
      else if (pointC === 240 || pointC === 254) c = 'd'
      // e <- è 8ca 232 é 9ca 233 ê bda 234 ë cda 235
      else if (pointC >= 232 && pointC <= 235) c = 'e'
      // i <- ì dda 236 í eda 237 î fda 238 ï gda 239
      else if (pointC >= 236 && pointC <= 239) c = 'i'
      // n <- ñ ida 241
      else if (pointC === 241) c = 'n'
      // o <- ò jda 242 ó kda 243 ô lda 244 õ mda 245 ö nda 246 ø pda 248
      else if (pointC >= 242 && pointC <= 246 || pointC === 248) c = 'o'
      // u <- ù qda 249 ú rda 250 û sda 251 ü tda 252
      else if (pointC >= 249 && pointC <= 252) c = 'u'
      // y <- ý uda 253 ÿ wda 255
      else if (pointC === 253 || pointC === 255) c = 'y'

      // find the emoji letter corresponding to the current char
      var current = _emojiLetterSet[c]
      // return the image of emoji letter
      return current ? toTwemoji(current) : toTwemoji(_emojiLetterSet['symbol'])
    })
    letterEmoji = letterEmoji.join('')
    $('#encryption_output').html(letterEmoji)

    emojiText = toTwemoji(emojiText)
    setTimeout(function () {
      $('#encryption_output').html(emojiText)
      $('.share_message_item').html(emojiText)
      Cryptoloji.stateman.emit('encrypt:show-share')
    }, 1500)
  }

  function handleHeader () {
    Cryptoloji.stateman.on('header:show', function () {
      $("#header").show()
    })
    Cryptoloji.stateman.on('header:hide', function () {
      $("#header").hide()
    })
  }

  function selectKey (key) {
    Cryptoloji.current.key = key
    console.debug('Chosen key', key)
    $(".share_key_emoji-item").html(toTwemoji(key))
  }

  function showDecryptableText (text) {
    $('#decryption_input').html(toTwemoji(text))
                          .attr('text', text)
  }




  function handleSvgLoading () {
    function loadSvg (element, path) {
      $.get(path)
       .done(function (result) {
          // console.log(result)
          $(element).append(result.documentElement)
          Cryptoloji.stateman.emit('svg:loaded', path)
        })
       .fail(function () {
          console.error(this)
        })
    }
    $("div[data-svg*='assets/svg']").each(function () {
      var self = this
      var path = $(self).attr('data-svg')
      // console.log(self, path)
      loadSvg(self, path)
    })

  }

  function toTwemoji (text) {
    return twemoji.parse(text, {
      folder: 'svg',
      ext:    '.svg'
    })
  }

  //////////////////////////////////////////////////////////////////////////////

  Cryptoloji.UI = {
    decryptText: decryptText,
    encryptText: encryptText,
    handleHeader: handleHeader,
    handleSvgLoading: handleSvgLoading,
    selectKey: selectKey,
    showDecryptableText: showDecryptableText,
    toTwemoji: toTwemoji
  }
  
})(window, window.Cryptoloji, window.jQuery, window.twemoji);
