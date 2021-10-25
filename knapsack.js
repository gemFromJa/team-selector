function knapSack(W, wt, val, n) {
    leK = Array(w + 1).map(() => Array(n + 1).map(() => -1));
    for (let i = 0; i < n + 1; i++) {
        for (let w = 0; w < W + 1; w++) {
            if (i == 0 || w == 0) {
                K[i][w] = 0;
            } else if (wt[i - 1] <= w) {
                K[i][w] = max(
                    val[i - 1] + K[i - 1][w - wt[i - 1]],
                    K[i - 1][w]
                );
            } else {
                K[i][w] = K[i - 1][w];
            }
        }
    }
    return K;
}
function knapSackIndex(W, wt, val, n, K) {
    res = K[-1][-1];
    ix = [];
    w = W;
    ix = [];
    for (let i = n; i > 0; i--) {
        if (res <= 0) {
            break;
        }

        if (res == K[i - 1][w]) {
            continue;
        } else {
            ix.append(i - 1);
            res = res - val[i - 1];
            w = w - wt[i - 1];
        }
    }

    return ix;
}
