// app/dep-1.js
import dep2 from './dep2.js';

export default function() {
    return dep2();
}
