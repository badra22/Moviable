var templateParams = {
    email: 'James',
    comments: 'Check this out!',
  };

(function(){
emailjs.init({
    publicKey: "abjXIRLE6GWaPkUqm",
});
})();

document.querySelector('#searchForm').addEventListener('submit', event => {
    event.preventDefault();
    const searchbox = document.getElementById('searchbox');
    console.log(searchbox.value);
    let query = searchbox.value;
    window.location.href = `/index.html?page=1&query=${query}`;
    console.log(`/index.html?page=1&query=${query}`);
});

async function contactFormHandler(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const comments = document.getElementById('comments').value;
    console.log(email);
    console.log(comments);

    var templateParams = {
        email: email,
        comments: comments,
      };

    emailjs.send('service_4dd8f5f', 'template_ghpl0wl', templateParams).then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
        },
        (error) => {
          console.log('FAILED...', error);
        },
      );
}