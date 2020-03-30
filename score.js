
const outputs=[];
function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
	outputs.push([dropPosition, bounciness, size, bucketLabel]);
	
}

function runAnalysis() {
  const testsetSize=100;
  const k=10;


  _.range(0,3).forEach(feature=>{
  const data=_.map(outputs,row=>[row[feature],_.last(row)]);
  const [testset,trainingset]=splitDataset(minMax(data,1),testsetSize);
  const Accuracy=_.chain(testset)
  .filter(testpoint=>knn(trainingset,_.initial(testpoint),k)===_.last(testpoint))
  .size()
  .divide(testsetSize)
  .value();

  console.log("for feature of",feature,"  Accuracy is", Accuracy);
});
}

function knn(data,point,k){
	return _.chain(data)
   .map(row=>{
   	return [distance(_.initial(row),point),
   	_.last(row)
   	];
    })
   .sortBy(row=>row[0])
   .slice(0,k)
   .countBy(row=>row[1])
   .toPairs()
   .sortBy(row=>row[1])
   .last()
   .first()
   .parseInt()
   .value();
}

function distance(pointA,pointB){
	return _.chain(pointA)
	.zip(pointB)
	.map(([a,b])=>(a-b)**2)
	.sum()
	.value()**0.5;
}
function splitDataset(data,testcount){
	const shuffuled=_.shuffle(data);
	const testset=_.slice(shuffuled,0,testcount);
	const trainingset=_.slice(shuffuled,testcount);

	return [testset,trainingset];
}


function minMax(data,featureCount){
	const clonedData=_.cloneDeep(data);
	for(let i=0;i<featureCount;i++){
		const column=clonedData.map(row=>row[i]);
		const max=_.max(column)
		const min=_.min(column)

		for(let j=0;j<clonedData.length;j++){
			 clonedData[j][i]=(clonedData[j][i]-min)/max-min
		}
	}
	return clonedData;
}