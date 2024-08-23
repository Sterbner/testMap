// let count = 0
// function quack (str){
//     const arr = str.split(' ')
//     const dp = new Array(arr.length).fill(0)
//     for (i = 0; i < arr.length/2;i++){

//     }
//     console.log(dp)
// }

const input = '7 5 9 4 2 6 8 3 5 4 3 9'
// const input1 = 'qucakkquack'
// quack (input)
// console.log(count)


const a = input.split(" ").map(Number);
 
// 获取数组的长度
const n = a.length;

// 初始化动态规划数组，dp[i]表示到达第i个位置所需的最少步骤数
const dp = new Array(n).fill(Infinity);

// 第一个位置的步骤数为0，因为从这里开始
dp[0] = 0;

// 初始化从第一个位置开始的步长，步长范围为1到len/2
for (let i = 1; i < n / 2; i++) {
    dp[i] = 1;
}

// 遍历数组，更新动态规划数组
for (let i = 0; i < n; i++) {
    // 如果当前位置的步长超出数组范围，跳过
    console.log('i',i,'a[i]',a[i],'dp[i + a[i]]',dp[i + a[i]],'dp[i] + 1',dp[i] + 1)
    if (i + a[i] >= n) {
        continue;
    }
    // 更新到达当前位置的步数
    
    dp[i + a[i]] = Math.min(dp[i + a[i]], dp[i] + 1);
}

// 输出结果，如果最后一个位置的步数仍为无穷大，表示不可达，输出-1
console.log(dp);
console.log(dp[n - 1] === Infinity ? -1 : dp[n - 1]);