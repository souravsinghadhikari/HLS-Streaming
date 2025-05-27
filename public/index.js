function uploadVideo() {
  const title = document.getElementById('title').value;
  const fileInput = document.getElementById('videoUpload');
  const formData = new FormData();

  formData.append('title', title);
  formData.append('video', fileInput.files[0]);

  const loader = document.getElementById('loader');
  loader.classList.remove('hidden'); // Show loader
  document.body.classList.add('no-scroll');
  const messageDiv = document.getElementById('message');

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Video uploaded and converted successfully.') {
        // loadTimeline();
        loader.classList.add('hidden'); // Hide loader
        document.body.classList.remove('no-scroll');
        alert('Video uploaded and converted successfully.');
        fileInput.value = null;
        loadVideos();
      } else {
        loader.classList.add('hidden');
        fileInput.value = null;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}