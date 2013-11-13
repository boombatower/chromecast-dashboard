/**
 * Main JavaScript for handling Chromecast interactions.
 */

var appId = '2c6e7388-90e6-422f-a9d8-4188399c8d5a';
var namespace = 'boombatower.chromecast-dashboard';

$(function() {
  var receiver = new cast.receiver.Receiver(appId, [namespace]);
  var channelHandler = new cast.receiver.ChannelHandler(namespace);
  channelHandler.addChannelFactory(receiver.createChannelFactory(namespace));
  receiver.start();
  channelHandler.addEventListener(cast.receiver.Channel.EventType.MESSAGE, onMessage.bind(this));

  function onMessage(event) {
    var message = event.message;
    if (message.type == 'load') {
      $('#dashboard').attr('src', message.url);
      if (message.refresh > 0) {
        $('#dashboard').attr('data-refresh', message.refresh * 1000);
        setTimeout(reloadDashboard, $('#dashboard').attr('data-refresh'));
      }
      else {
        $('#dashboard').attr('data-refresh', 0);
      }
    }
  }

  function reloadDashboard() {
    $('#dashboard').attr('src', $('#dashboard').attr('src'));
    if ($('#dashboard').attr('data-refresh')) {
      setTimeout(reloadDashboard, $('#dashboard').attr('data-refresh'));
    }
  }

  $('#dashboard').load(function() {
    $('#loading').hide();
    console.log('Loading animation hidden.');
  });
});
