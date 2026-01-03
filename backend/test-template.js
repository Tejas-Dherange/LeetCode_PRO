// Test the code template engine
import { processCodeSnippet } from './libs/codeTemplateEngine.js';

const javaCode = `// BOILERPLATE_HIDDEN_START
import java.util.*;
import java.io.*;
// BOILERPLATE_HIDDEN_END

// USER_CODE_START
public class Main {
    /**
     * @param int[] arr
     * @param int sum
     * @return int
     */
    public static int countTriplets(int[] arr, int sum) {
        // Write your code here
        return 0;
    }
// USER_CODE_END

// BOILERPLATE_HIDDEN_START
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String[] firstLine = br.readLine().split(" ");
        int n = Integer.parseInt(firstLine[0]);
        int sum = Integer.parseInt(firstLine[1]);
        
        String[] arrStr = br.readLine().split(" ");
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = Integer.parseInt(arrStr[i]);
        }
        
        int result = countTriplets(arr, sum);
        System.out.println(result);
    }
}
// BOILERPLATE_HIDDEN_END`;

console.log('=== TESTING CODE TEMPLATE ENGINE ===\n');
console.log('Input code length:', javaCode.length);

const result = processCodeSnippet(javaCode);

console.log('\n=== STUDENT VIEW ===');
console.log(result.studentView);
console.log('\n=== END ===');
console.log('Student view length:', result.studentView.length);
console.log('Contains USER_CODE_START?', result.studentView.includes('USER_CODE_START'));
console.log('Contains USER_CODE_END?', result.studentView.includes('USER_CODE_END'));
console.log('Contains BOILERPLATE_HIDDEN?', result.studentView.includes('BOILERPLATE_HIDDEN'));
