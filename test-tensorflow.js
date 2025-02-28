import * as tf from "@tensorflow/tfjs"

console.log("TensorFlow.js version:", tf.version.tfjs)
console.log("Backend:", tf.getBackend())

// Simple tensor operation
const a = tf.tensor1d([1, 2, 3])
const b = tf.tensor1d([4, 5, 6])
const c = a.add(b)

c.print()
console.log("Tensor operation successful!")

