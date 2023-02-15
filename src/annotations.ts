import { data$, LiveData } from './extension';
import { CodeManager, ExpressionQuery } from './codeManager';
import { filter, Subject, Subscription, tap, map } from 'rxjs';
import {
  Decoration,
  HighlightDecoration,
  TextDecoration,
  WebViewDecoration,
  P5ViewDecoration,
} from './decorations';
import { ExpressionEngine } from './expressions';
import { loadavg } from 'os';
import { transpileExpression } from './parser';

class Annotation {
  // private sub: Subscription;
  // private highlightDec: Decoration;
  // private textDec: Decoration;
  // private wv: P5ViewDecoration;

  constructor(
    private id: string,
    private line: number,
    private expression: string,
    data$: Subject<LiveData>
  ) {
    // Create decorators for line and for text
    // this.highlightDec = new HighlightDecoration(line);
    // this.textDec = new TextDecoration(line);
    // this.textDec.decorate({
    //   contentText: 'None',
    // });
    // this.wv = new P5ViewDecoration(line);
    // this.wv.decorate('<h1>Hi</h1><p>asdf</p>');
    // this.wv.decorate();

    // console.log(id, line, expression);
    try {
      let expr = transpileExpression(expression);
      expr = expr.replaceAll('$$', '60');
      expr = expr.replaceAll('$', 'this.');
      console.log(expr);

      console.log('Expression to evaluate: ' + expr);
      let result = ExpressionEngine.getInstance().evalExpression(expr);
      console.log('Result: ', result);
    } catch (err: any) {
      console.log('error ', err.message);
    }

    // livedata contains => id line values

    // Filted and subscribe
    // this.sub = data$
    //   .pipe(
    //     filter((d) => id === d.id), // filter by id
    //     map(({ values }) => values[0] + 'asdfasdf')
    //   )

    // .subscribe((val: string) => {
    //   console.log('val: ' + val);

    // Compute the result
    // let expr = expression.replaceAll('$$', values[0]);
    // const { value, success } =
    //   ExpressionEngine.getInstance().evalInContext(expr);

    // let color: string = 'DodgerBlue';
    // Update decorations
    // this.highlightDec.decorate(500);
    // this.textDec.decorate({
    //   contentText: `${value}`,
    //   color,
    // });
    // this.wv.update(values[0]);
    // });
  }

  dispose() {
    // this.highlightDec.dispose();
    // this.textDec.dispose();
    // this.wv.dispose();
    // this.sub?.unsubscribe();
  }
}

///////

let annotations: Annotation[] = [];

// id, line, values_on_line, expression, decoration
export function createAnnotations() {
  const queries = CodeManager.getInstance().getExpressionQueries();

  // if they exist, remove them
  if (isAnyAnnotation()) clearAnnotations();

  annotations = queries.map(
    ({ id, line, expression }: ExpressionQuery) =>
      new Annotation(id, line, expression, data$)
  );
}

function isAnyAnnotation() {
  return annotations.length > 0;
}

export function clearAnnotations() {
  annotations.forEach((a) => a.dispose());
  annotations = [];
}
