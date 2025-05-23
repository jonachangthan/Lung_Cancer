var wait = document.getElementById("wait")
var re = document.getElementById("result")
// 使用fetch發送GET請求獲取後端JSON檔案
fetch('/recognize')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const result = data.result;
    wait.style.display="none"
    re.value = result

    console.log(result);
  })
  .catch(error => {
    console.error('Error fetching the JSON file:', error);
  });

