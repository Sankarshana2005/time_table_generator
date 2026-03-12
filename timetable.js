const Random = {
  randint: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  
  shuffle: (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
};

function buildTimetable(subjects, days, slots) {
  let matrix = [];

  let existingRows = new Set(); 

  for (let d = 0; d < days; d++) {
    let row = [];
    let isValidRow = false;
    let attempts = 0;

    
    while (!isValidRow && attempts < 100) {
      row = [];
      let pool = [];
      
      for (let s = 0; s < slots; s++) {
        if (s === 3) { 
          row.push("Lunch Break");
          continue;
        }

        if (pool.length === 0) {
          pool = [...subjects];
          Random.shuffle(pool);
        }

        let subject = pool.shift();

        const isDuplicateHorizontal = s > 0 && subject === row[s - 1];
        const isDuplicateVertical = d > 0 && subject === matrix[d - 1][s];

        if ((isDuplicateHorizontal || isDuplicateVertical) && pool.length > 0) {
          const swapIdx = Random.randint(0, pool.length - 1);
          const temp = subject;
          subject = pool[swapIdx];
          pool[swapIdx] = temp;
        }
        row.push(subject);
      }

      let rowString = row.join("|");
      if (!existingRows.has(rowString)) {
        existingRows.add(rowString);
        matrix.push(row);
        isValidRow = true;
      }
      attempts++;
    }
  }
  return matrix;
}
export default buildTimetable;