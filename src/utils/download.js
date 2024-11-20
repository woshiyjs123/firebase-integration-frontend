// export function downloadFile(data, name, suffix = ".xlsx") {
// 	const suffixReg = /^\./;
// 	if (!suffixReg.test(suffix)) suffix = `.${suffix}`;
// 	let type = "text/plain";
// 	if (suffix === ".xlsx") type = "application/vnd.ms-excel";
// 	let blob = new Blob([data], { type });
// 	let fileName = name + suffix;
// 	let downloadElement = document.createElement("a");
// 	downloadElement.href = window.URL.createObjectURL(blob);
// 	downloadElement.download = fileName;
// 	document.body.appendChild(downloadElement);
// 	//模拟一次点击
// 	downloadElement.click();
// 	document.body.removeChild(downloadElement);
// }
export function downloadFile(data, name) {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  downloadUrl.value = url
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}