function maxReward(T, n, jobs) {
    // 初始化DP数组，大小为(T+1)
    let dp = new Array(T + 1).fill(0);

    for (let i = 0; i < n; i++) {
        let t = jobs[i][0]; // 20 
        let w = jobs[i][1]; // 10

        // 倒序遍历时间从T到t，以避免覆盖上一轮的结果
        for (let j = T; j >= t; j--) { // T = 40
            
            dp[j] = Math.max(dp[j], dp[j - t] + w);
            console.log(dp[j]),dp[j - t],w;
        }
    }

    // dp[T] 表示在工作时间不超过T时，能够获得的最大报酬
    return dp[T];
}

// 示例输入
const T = 40;
const n = 3;
const jobs = [
    [20, 10],
    [20, 20],
    [20, 5]
];

// 调用函数
console.log(maxReward(T, n, jobs)); // 输出 30