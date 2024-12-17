// 获取矩形和容器元素
const rectangles = document.querySelectorAll('.rectangle');

// 加载 `1.html` 文件内容
async function loadHtmlContent() {
    const response = await fetch('1.html'); // 确保路径正确
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.body; // 返回解析后的 HTML Body
}

// 加载 `2.html` 文件内容
async function loadHtmlContent() {
    const response = await fetch('2.html'); // 确保路径正确
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.body; // 返回解析后的 HTML Body
}

// 加载 `3.html` 文件内容
async function loadHtmlContent() {
    const response = await fetch('2.html'); // 确保路径正确
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.body; // 返回解析后的 HTML Body
}

// 加载 `4.html` 文件内容
async function loadHtmlContent() {
    const response = await fetch('2.html'); // 确保路径正确
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.body; // 返回解析后的 HTML Body
}


// 从 dataFlow.csv 文件加载数据
async function loadFlowData() {
    const response = await fetch('dataFlow.csv');
    const text = await response.text();
    const rows = text.split('\n');
    const data = rows.slice(1)
        .map(row => row.split(','))
        .filter(row => row.length >= 7);

    // 提取 Total_Flow_Population 和 M_per 数据
    const flowData = data.map(row => ({
        population: parseFloat(row[2].trim()),        // Total_Flow_Population
        male: parseInt(row[3].trim()),               // Male
        malePercentage: parseFloat(row[4].trim()),   // M_per
        female: parseInt(row[5].trim()),             // Female
        femalePercentage: parseFloat(row[6].trim())  // F_per
    }));
    return flowData;
}

// 从 dataLmt.csv 文件加载数据
async function loadLmtData() {
    const response = await fetch('dataLmt.csv');
    const text = await response.text();
    const rows = text.split('\n');
    const data = rows.slice(1)
        .map(row => row.split(','))
        .filter(row => row.length >= 8);

    // 提取百分比数据
    const lmtData = data.map(row => ({
        lyPercent: parseFloat(row[2].trim()),
        lnPercent: parseFloat(row[4].trim()),
        ryPercent: parseFloat(row[6].trim()),
        rnPercent: parseFloat(row[8].trim())
    }));
    return lmtData;
}

// 初始化矩形
async function initializeRectangles() {
    const flowData = await loadFlowData();
    const lmtData = await loadLmtData();
    const htmlContent = await loadHtmlContent(); // 加载 `1.html` 内容


    // 初始化：设置默认所有伪元素可见
    let isRectangleClicked = false;

    rectangles.forEach((rect, index) => {
        rect.addEventListener('click', () => {
            // 检查是否是重复点击
            const alreadyClicked = rect.classList.contains('active');
    
            // 先清除所有矩形的 "active" 状态和隐藏伪元素
            rectangles.forEach(r => {
                r.classList.remove('active');
                r.classList.remove('hide-month');
            });
    
            if (!alreadyClicked) {
                // 标记当前矩形为 "active"
                rect.classList.add('active');
    
                // 隐藏其他矩形的伪元素
                rectangles.forEach((r, idx) => {
                    if (idx !== index) {
                        r.classList.add('hide-month');
                    }
                });
    
                // 标记矩形点击状态为 `true`
                isRectangleClicked = true;
            } else {
                // 如果是重复点击，重置状态
                isRectangleClicked = false;
            }
        });
    });
    

    rectangles.forEach((rect, index) => {
        const flow = flowData[index] || {};
        const lmt = lmtData[index] || {};
        // 确保每个矩形正确关联到 `1.html` 的 Pie Chart
        const contentId = `chart${index + 1}`; // 假设每个 Pie Chart 的 `id` 为 chart1, chart2, ..., chart10
        const malePercentage = flow.malePercentage / 100; // 将百分比转换为 0-1 的小数
        const femalePercentage = flow.femalePercentage / 100;


        if (flow.population != null) {
            const percentage = flow.population / 25000;
            const rectHeight = rect.offsetHeight;
            const pixelHeight = rectHeight * percentage;
            rect.style.setProperty('--dot-bottom', `${pixelHeight}px`);
        }

        rect.addEventListener('click', (e) => {
            e.stopPropagation();
            const clickedId = e.target.closest('.rectangle').dataset.id;
            

            rectangles.forEach((r, idx) => {
                if (r.dataset.id === clickedId) {
                    const dotBottom = parseFloat(getComputedStyle(r).getPropertyValue('--dot-bottom'));
                    const malePercentage = flow.malePercentage / 100;
                    const blueHeight = (dotBottom + 5) * malePercentage;
                    const redHeight = dotBottom + 5 - blueHeight;

                    r.classList.add('dynamic-content');
                    r.style.width = '440px'; // Adjust width to accommodate the charts on the right
                    r.innerHTML = '';

                    // Render Blue Rectangle    
                    const blueRect = document.createElement('div');
                    blueRect.style.position = 'absolute';
                    blueRect.style.bottom = '0';
                    blueRect.style.left = '0';
                    blueRect.style.width = '220px';
                    blueRect.style.height = `${blueHeight}px`;
                    blueRect.style.backgroundColor = 'blue';

                    // Add text inside the blue rectangle
                    const blueText = document.createElement('div');
                    blueText.innerHTML = `Men<br>${flow.male} (${flow.malePercentage.toFixed(2)}%)`;
                    blueText.style.position = 'absolute';
                    blueText.style.top = '50%';
                    blueText.style.left = '50%';
                    blueText.style.transform = 'translate(-50%, -50%)'; // Center the text
                    blueText.style.color = 'white'; // Text color
                    blueText.style.fontSize = '14px';
                    blueText.style.fontWeight = 'bold';
                    blueText.style.textAlign = 'center';
                    blueRect.appendChild(blueText);

                    // Render Red Rectangle   
                    const redRect = document.createElement('div');
                    redRect.style.position = 'absolute';
                    redRect.style.bottom = `${blueHeight}px`;
                    redRect.style.left = '0';
                    redRect.style.width = '220px';
                    redRect.style.height = `${redHeight}px`;
                    redRect.style.backgroundColor = 'red';

                    // Add text inside the red rectangle
                    const redText = document.createElement('div');
                    redText.innerHTML = `Women<br>${flow.female} (${flow.femalePercentage.toFixed(2)}%)`;
                    redText.style.position = 'absolute';
                    redText.style.top = '50%';
                    redText.style.left = '50%';
                    redText.style.transform = 'translate(-50%, -50%)'; // Center the text
                    redText.style.color = 'white'; // Text color
                    redText.style.fontSize = '14px';
                    redText.style.fontWeight = 'bold';
                    redText.style.textAlign = 'center';
                    redRect.appendChild(redText);

                    // Append rectangles
                    r.appendChild(blueRect);
                    r.appendChild(redRect);



                    // Create a container for the two main containers
                    const mainContainer = document.createElement('div');
                    mainContainer.style.position = 'absolute';
                    mainContainer.style.right = '10px';
                    mainContainer.style.top = '53%';
                    mainContainer.style.transform = 'translateY(-50%)';
                    mainContainer.style.display = 'flex';
                    mainContainer.style.flexDirection = 'column';
                    mainContainer.style.gap = '20px'; // Space between top and bottom containers

                    // Add Circle (new feature)
                    const circle = document.createElement('div');
                    circle.style.width = '200px'; // Diameter = 2 * radius
                    circle.style.height = '250px'; // Diameter = 2 * radius
                    circle.style.backgroundColor = 'none';
                    circle.style.margin = '0 auto'; // Center horizontally
                    circle.style.marginBottom = '-10px'; // Add spacing below
                    circle.classList.add('circle');
                    
                    mainContainer.appendChild(circle);

                    // Create top container with title
                    const topContainer = document.createElement('div');
                    topContainer.style.display = 'flex';
                    topContainer.style.flexDirection = 'column';
                    topContainer.style.gap = '2px';

                    const topTitle = document.createElement('div');
                    topTitle.textContent = 'Longterm Migration or Not?';
                    topTitle.style.fontWeight = 'bold';
                    topTitle.style.textAlign = 'center';
                    topContainer.appendChild(topTitle);
                    topTitle.style.fontSize = '13px';

                    const topRow = document.createElement('div');
                    topRow.style.display = 'flex';
                    topRow.style.position = 'relative';
                    topRow.style.gap = '0px';

                    const topShapes = [
                        { width: `${(lmt.lyPercent / 100) * 200}px`, height: '20px', color: 'lightblue', text: `${lmt.lyPercent}%  Yes` },
                        { width: `${(lmt.lnPercent / 100) * 200}px`, height: '20px', color: 'lightgreen', text: `${lmt.lnPercent}%  No` }
                    ];

                    topShapes.forEach(shape => {
                        const rectangle = document.createElement('div');
                        rectangle.style.width = shape.width;
                        rectangle.style.height = shape.height;
                        rectangle.style.backgroundColor = shape.color;
                        rectangle.style.position = 'relative';

                        const text = document.createElement('div');
                        text.textContent = shape.text;
                        text.style.position = 'absolute';
                        text.style.bottom = '-13px';
                        text.style.textAlign = 'center';
                        text.style.width = shape.width;
                        text.style.fontSize = '12px';
                        text.style.overflow = 'visible';
                        text.style.whiteSpace = 'nowrap';

                        rectangle.appendChild(text);

                        // **Add hover effect for lightblue rectangle**
                        if (shape.color === 'lightblue') {
                            rectangle.addEventListener('mouseenter', () => {
                                const circle = document.querySelector('.circle');

                                if (!circle) {
                                    console.error('Circle element not found.');
                                    return;
                                }

                                // 清空 circle 内容
                                circle.innerHTML = '';

                                // 创建 iframe 加载 HTML 文件
                                const iframe = document.createElement('iframe');
                                iframe.src = `1.html#${contentId}`; // 使用锚点加载特定内容块
                                iframe.style.width = '220px'; // 设置 iframe 宽度
                                iframe.style.height = '220px'; // 设置 iframe 高度
                                iframe.style.border = 'none'; // 移除 iframe 边框
                                iframe.style.overflow = 'hidden';
                                iframe.scrolling = 'no';

                                // 添加 iframe 到 circle
                                circle.appendChild(iframe);

                                // 确保 circle 的样式支持居中
                                circle.style.display = 'flex'; // 使用 flexbox 布局
                                circle.style.justifyContent = 'center'; // 水平居中
                                circle.style.alignItems = 'center'; // 垂直居中
                            });

                            rectangle.addEventListener('mouseleave', () => {
                                // 不立即清空内容，设置一个标志等待鼠标进入其他区域
                                rectangle.classList.add('waiting-clear');
                            });
                        }

                        // **Add hover effect for lightgreen rectangle**                        
                        if (shape.color === 'lightgreen') {
                            rectangle.addEventListener('mouseenter', () => {
                                const circle = document.querySelector('.circle');

                                if (!circle) {
                                    console.error('Circle element not found.');
                                    return;
                                }

                                // 清空 circle 内容
                                circle.innerHTML = '';

                                // 创建 iframe 加载 HTML 文件
                                const iframe = document.createElement('iframe');
                                iframe.src = `2.html#${contentId}`; // 使用锚点加载特定内容块
                                iframe.style.width = '220px'; // 设置 iframe 宽度
                                iframe.style.height = '220px'; // 设置 iframe 高度
                                iframe.style.border = 'none'; // 移除 iframe 边框
                                iframe.style.overflow = 'hidden';
                                iframe.scrolling = 'no';

                                // 添加 iframe 到 circle
                                circle.appendChild(iframe);

                                // 确保 circle 的样式支持居中
                                circle.style.display = 'flex'; // 使用 flexbox 布局
                                circle.style.justifyContent = 'center'; // 水平居中
                                circle.style.alignItems = 'center'; // 垂直居中
                            });

                            

                            rectangle.addEventListener('mouseleave', () => {
                                // 不立即清空内容，设置一个标志等待鼠标进入其他区域
                                rectangle.classList.add('waiting-clear');
                            });
                        }

                        topRow.appendChild(rectangle);
                    });

                    topContainer.appendChild(topRow);

                    // Create bottom container with title
                    const bottomContainer = document.createElement('div');
                    bottomContainer.style.display = 'flex';
                    bottomContainer.style.flexDirection = 'column';
                    bottomContainer.style.gap = '2px';

                    const bottomTitle = document.createElement('div');
                    bottomTitle.textContent = 'Registered Refugee or Not?';
                    bottomTitle.style.fontWeight = 'bold';
                    bottomTitle.style.textAlign = 'center';
                    bottomContainer.appendChild(bottomTitle);
                    bottomTitle.style.fontSize = '13px';

                    const bottomRow = document.createElement('div');
                    bottomRow.style.display = 'flex';
                    bottomRow.style.gap = '0px';

                    const bottomShapes = [
                        { width: `${(lmt.ryPercent / 100) * 200}px`, height: '20px', color: 'lightcoral', text: `${lmt.ryPercent}% Yes` },
                        { width: `${(lmt.rnPercent / 100) * 200}px`, height: '20px', color: 'lightsalmon', text: `${lmt.rnPercent}%  No` }
                    ];

                    bottomShapes.forEach(shape => {
                        const rectangle = document.createElement('div');
                        rectangle.style.width = shape.width;
                        rectangle.style.height = shape.height;
                        rectangle.style.backgroundColor = shape.color;
                        rectangle.style.position = 'relative';

                        const text = document.createElement('div');
                        text.textContent = shape.text;
                        text.style.position = 'absolute';
                        text.style.bottom = '-13px';
                        text.style.textAlign = 'center';
                        text.style.width = shape.width;
                        text.style.fontSize = '12px';
                        text.style.overflow = 'visible';
                        text.style.whiteSpace = 'nowrap';

                        rectangle.appendChild(text);

                        // **Add hover effect for lightcoral rectangle**
                        if (shape.color === 'lightcoral') {
                            rectangle.addEventListener('mouseenter', () => {
                                const circle = document.querySelector('.circle');

                                if (!circle) {
                                    console.error('Circle element not found.');
                                    return;
                                }

                                // 清空 circle 内容
                                circle.innerHTML = '';

                                // 创建 iframe 加载 HTML 文件
                                const iframe = document.createElement('iframe');
                                iframe.src = `3.html#${contentId}`; // 使用锚点加载特定内容块
                                iframe.style.width = '220px'; // 设置 iframe 宽度
                                iframe.style.height = '220px'; // 设置 iframe 高度
                                iframe.style.border = 'none'; // 移除 iframe 边框
                                iframe.style.overflow = 'hidden';
                                iframe.scrolling = 'no';

                                // 添加 iframe 到 circle
                                circle.appendChild(iframe);

                                // 确保 circle 的样式支持居中
                                circle.style.display = 'flex'; // 使用 flexbox 布局
                                circle.style.justifyContent = 'center'; // 水平居中
                                circle.style.alignItems = 'center'; // 垂直居中
                            });

                            rectangle.addEventListener('mouseleave', () => {
                                // 不立即清空内容，设置一个标志等待鼠标进入其他区域
                                rectangle.classList.add('waiting-clear');
                            });
                        }

                        // **Add hover effect for lightsalmon rectangle**                        
                        if (shape.color === 'lightsalmon') {
                            rectangle.addEventListener('mouseenter', () => {
                                const circle = document.querySelector('.circle');

                                if (!circle) {
                                    console.error('Circle element not found.');
                                    return;
                                }

                                // 清空 circle 内容
                                circle.innerHTML = '';

                                // 创建 iframe 加载 HTML 文件
                                const iframe = document.createElement('iframe');
                                iframe.src = `4.html#${contentId}`; // 使用锚点加载特定内容块
                                iframe.style.width = '220px'; // 设置 iframe 宽度
                                iframe.style.height = '220px'; // 设置 iframe 高度
                                iframe.style.border = 'none'; // 移除 iframe 边框
                                iframe.style.overflow = 'hidden';
                                iframe.scrolling = 'no';

                                // 添加 iframe 到 circle
                                circle.appendChild(iframe);

                                // 确保 circle 的样式支持居中
                                circle.style.display = 'flex'; // 使用 flexbox 布局
                                circle.style.justifyContent = 'center'; // 水平居中
                                circle.style.alignItems = 'center'; // 垂直居中
                            });

                            

                            rectangle.addEventListener('mouseleave', () => {
                                // 不立即清空内容，设置一个标志等待鼠标进入其他区域
                                rectangle.classList.add('waiting-clear');
                            });
                        }



                        bottomRow.appendChild(rectangle);
                    });

                    bottomContainer.appendChild(bottomRow);

                    // Append top and bottom containers to the main container
                    mainContainer.appendChild(topContainer);
                    mainContainer.appendChild(bottomContainer);

                    // Append main container to the rectangle
                    r.appendChild(mainContainer);
                } else {
                    r.style.width = '40px';
                    r.classList.remove('dynamic-content');
                    r.innerHTML = '';
                }
            });
        });
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.rectangle .dynamic-content')) return;
        rectangles.forEach((r) => {
            r.style.width = '80px';
            r.classList.remove('dynamic-content');
            r.innerHTML = '';
        });
        if (!e.target.closest('.rectangle')) {
            rectangles.forEach(r => {
                r.classList.remove('hide-month'); // 显示所有伪元素
                r.classList.remove('active'); // 移除 "active" 状态
            });
    
            isRectangleClicked = false;
        }
    });

    
}

// Initialize the rectangles
initializeRectangles();
