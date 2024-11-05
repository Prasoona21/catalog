const fs = require('fs');
const BigNumber = require('bignumber.js');
function decodeYValues(points) {
    return points.map(point => {
        const x = parseInt(point.key, 10);
        const y = new BigNumber(point.value, point.base);
        return { x, y };
    });
}
function findConstantTerm(points, k) {
    let constantTerm = new BigNumber(0);

    for (let i = 0; i < k; i++) {
        const p_i = points[i];
        let li = new BigNumber(1);

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const p_j = points[j];
                const numerator = new BigNumber(-p_j.x);
                const denominator = new BigNumber(p_i.x - p_j.x);
                li = li.multipliedBy(numerator.dividedBy(denominator));
            }
        }
        constantTerm = constantTerm.plus(p_i.y.multipliedBy(li));
    }

    return constantTerm;
}
function calculateSecret(filename) {
    const data = fs.readFileSync(filename);
    const jsonObject = JSON.parse(data);
    const { n, k } = jsonObject.keys;
    const points = Object.entries(jsonObject)
        .filter(([key]) => /^\d+$/.test(key))
        .map(([key, { base, value }]) => ({ key, base: parseInt(base, 10), value }));
    const decodedPoints = decodeYValues(points);
    const secret = findConstantTerm(decodedPoints, k);
    console.log(Secret (constant term 'c'): ${secret.toFixed()});
}
calculateSecret('input.json');
