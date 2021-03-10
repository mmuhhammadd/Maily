document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#reply-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#reply-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Inbox mailbox view
  if (mailbox == 'inbox') {

    // Getting and showing inbox emails
    fetch('emails/inbox')
    .then(response => response.json())
    .then(function (emails) {
      document.querySelector('#emails-view').innerHTML = "";
       // Show the mailbox name
      document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

      emails.forEach(email => {
        const element = document.createElement('div');
        element.setAttribute('class', 'email-div');
        element.setAttribute('id', email.read);
        element.innerHTML = `
        <a href="#">
          <ul>
          <li><strong>From: </strong>${email.sender}</li>
          <li><strong>Subject: </strong>${email.subject}</li>
          <li><em>${email.timestamp}</em></li>
          </ul>
        </a>
        `;
        document.querySelector('#emails-view').append(element);

        // Marking read emails
        element.addEventListener('click', e => {
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
          });

          email_view('inbox', email.id);
          e.preventDefault();
        });
      });
    });
  }

  // Sent mailbox
  else if (mailbox == 'sent') {
    fetch('/emails/sent')
    .then(response => response.json())
    .then(function (emails) {
      document.querySelector('#emails-view').innerHTML = "";
       // Show the mailbox name
      document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

      emails.forEach(email => {
        const element = document.createElement('div');
        element.setAttribute('class', 'email-div');
        element.setAttribute('id', email.read);
        element.innerHTML = `
        <a href="#">
        <ul>
        <li><strong>Recipients: </strong>${email.recipients}</li>
        <li><strong>Subject: </strong>${email.subject}</li>
        <li><em>${email.timestamp}</em></li>
        </ul>
        </a>
        `;
        document.querySelector('#emails-view').append(element);

        // Navigating to mail view 
        element.addEventListener('click', e => {
          email_view('sent', email.id);
          e.preventDefault();
        });
      });
    });
  }

  // Archive mailbox
  else {
    fetch('/emails/archive')
    .then(response => response.json())
    .then(function (emails) {
      document.querySelector('#emails-view').innerHTML = "";
       // Show the mailbox name
      document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

      emails.forEach(email => {
        const element = document.createElement('div');
        element.setAttribute('class', 'email-div');
        element.setAttribute('id', email.read);
        element.innerHTML = `
        <a href="#">
        <ul>
        <li><strong>From: </strong>${email.sender}</li>
        <li><strong>Subject: </strong>${email.subject}</li>
        <li><em>${email.timestamp}</em></li>
        </ul>
        </a>
        `;
        document.querySelector('#emails-view').append(element);

        // Navigating to mail view 
        element.addEventListener('click', e => {
          email_view('archive', email.id);
          e.preventDefault();
        });
      });
    });
  }

}

// Single email view function
function email_view (mailbox, mail_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#reply-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'flex';

  fetch(`/emails/${mail_id}`)
  .then(response => response.json())
  .then(function(email) {

   var id = email.id;
   var timestamp = email.timestamp;
   var sender = email.sender;
   var recipient = email.recipients;
   var subject = email.subject;
   var body = email.body;

   // Inbox single mail view
   if (mailbox == 'inbox') {
    document.querySelector('#unarchive').style.display = 'none';
    document.querySelector('#sentview').style.display = 'none';
    document.querySelector('#archive').style.display = 'inline';
    document.querySelector('#reply').style.display = 'inline';
    document.querySelector('#inboxview').style.display = 'inline';

    document.querySelector('#mailsubject').innerHTML = `${subject}`;
    document.querySelector('#mailsender').innerHTML = `<strong>From: </strong>${sender}`;
    document.querySelector('#mailbody').innerHTML = `${body}`;
    document.querySelector('#timestamp').innerHTML = `${timestamp}`;

    // archiving an email
    document.querySelector('#archive').addEventListener('click', () => {
      archive_mail(id);
      setTimeout(load_mailbox, 1000, 'inbox');

    });

    // replying to an email
    document.querySelector('#reply').addEventListener('click', () => {
      reply(id);
    });

  }
  // Sent single mail view
   else if (mailbox == 'sent') {
    document.querySelector('#unarchive').style.display = 'none';
    document.querySelector('#archive').style.display = 'none';
    document.querySelector('#reply').style.display = 'none';
    document.querySelector('#inboxview').style.display = 'none';
    document.querySelector('#sentview').style.display = 'inline';
    
    document.querySelector('#mailsubject').innerHTML = `${subject}`;
    document.querySelector('#mailrecipient').innerHTML = `<strong>To: </strong>${recipient}`;
    document.querySelector('#mailbody').innerHTML = `${body}`;
    document.querySelector('#timestamp').innerHTML = `${timestamp}`;

  }
  // Archived single mail view
   else if (mailbox == 'archive') {
    document.querySelector('#reply').style.display = 'none';
    document.querySelector('#archive').style.display = 'none';
    document.querySelector('#sentview').style.display = 'none';
    document.querySelector('#unarchive').style.display = 'inline';
    document.querySelector('#inboxview').style.display = 'inline';


    document.querySelector('#mailsubject').innerHTML = `${subject}`;
    document.querySelector('#mailsender').innerHTML = `<strong>From: </strong>${sender}`;
    document.querySelector('#mailbody').innerHTML = `${body}`;
    document.querySelector('#timestamp').innerHTML = `${timestamp}`;

    // Unarchiving an email
    document.querySelector('#unarchive').addEventListener('click', () => {
      unarchive_mail(id);
      setTimeout(load_mailbox, 1000, 'inbox');
    });

  }
  });
}


// Mail submit function
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#compose-form').addEventListener('submit', function(e) {

    // Getting mail fields values
    const mailRecipients = document.querySelector('#compose-recipients').value;
    const mailSubject = document.querySelector('#compose-subject').value;
    const mailBody = document.querySelector('#compose-body').value;

    // Sending the email
    fetch('/emails', {
      method : 'POST',
      body: JSON.stringify({
        recipients: mailRecipients,
        subject: mailSubject,
        body: mailBody
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });

    // loading sent mailbox
    setTimeout(load_mailbox, 1000, 'sent');

    // Preventing form from submitting
    e.preventDefault();
  });
});

// Archiving emails function
function archive_mail(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
}

//  Unarchiving emails function
function unarchive_mail(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  })
}

// Reply view
function reply(email_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#reply-view').style.display = 'block';

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {

    document.querySelector('#reply-recipients').value = `${email.sender}`;
    document.querySelector('#reply-recipients').disabled = true;

    document.querySelector('#reply-subject').value = `Re: ${email.subject}`;
    document.querySelector('#reply-subject').disabled = true;
    document.querySelector('#reply-body').value = `On ${email.timestamp} ${email.sender} wrote: '${email.body}'`;
  })

}

// reply submit function
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#reply-form').addEventListener('submit', function(e) {

    // Getting mail fields values
    const replyrecipient = document.querySelector('#reply-recipients').value;
    const replysubject = document.querySelector('#reply-subject').value;
    const replybody = document.querySelector('#reply-body').value;

    // Sending the email
    fetch('/emails', {
      method : 'POST',
      body: JSON.stringify({
        recipients: replyrecipient,
        subject: replysubject,
        body: replybody
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });

    // loading sent mailbox
    setTimeout(load_mailbox, 1000, 'sent');

    // Preventing form from submitting
    e.preventDefault();
  });
});