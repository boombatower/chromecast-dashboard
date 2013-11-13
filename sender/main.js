/**
 * Main JavaScript for handling Chromecast interactions.
 */

var cast_api,
    cv_activity,
    receiverList,
    $killSwitch = $('.kill');

window.addEventListener('message', function(event) {
  if (event.source === window && event.data &&
      event.data.source === 'CastApi' &&
      event.data.event === 'Hello') {
    initializeApi();
  }
});

initializeApi = function() {
  if (!cast_api) {
    cast_api = new cast.Api();
    cast_api.addReceiverListener('2c6e7388-90e6-422f-a9d8-4188399c8d5a', onReceiverList);
  }
};

onReceiverList = function(list) {
  if (list.length > 0) {
    receiverList = list;
    $('.receiver-list').empty();
    receiverList.forEach(function(receiver) {
      $listItem = $('<li><a href="#" data-id="' + receiver.id + '">' + receiver.name + '</a></li>');
      $listItem.on('click', receiverClicked);
      $('.receiver-list').append($listItem);
    });
  }
};

receiverClicked = function(e) {
  e.preventDefault();

  var $target = $(e.target),
    receiver = _.find(receiverList, function(receiver) {
      return receiver.id === $target.data('id');
    });

  doLaunch(receiver);
};

doLaunch = function(receiver) {
  if (!cv_activity) {
    var request = new cast.LaunchRequest('2c6e7388-90e6-422f-a9d8-4188399c8d5a', receiver);

    $killSwitch.prop('disabled', false);

    cast_api.launch(request, onLaunch);
  }
};

onLaunch = function(activity) {
  if (activity.status === 'running') {
    cv_activity = activity;

    cast_api.sendMessage(cv_activity.activityId, 'boombatower', {
      type: 'load',
      url: $('#url').val(),
      refresh: $('#refresh').val()
    });
  }
};

$killSwitch.on('click', function() {
  cast_api.stopActivity(cv_activity.activityId, function(){
    cv_activity = null;

    $killSwitch.prop('disabled', true);
  });
});
