import { useRef } from 'react';
import { Card, CardContent, CardHeader } from './card';
import { Button } from './button';

const MinimalTextEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  const format = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <Card className="max-w-2xl w-full mx-auto mt-6">
      <CardHeader>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => format('bold')}>
            <b>B</b>
          </Button>
          <Button variant="outline" size="sm" onClick={() => format('italic')}>
            <i>I</i>
          </Button>
          <Button variant="outline" size="sm" onClick={() => format('formatBlock', '<h1>')}>
            H1
          </Button>
          <Button variant="outline" size="sm" onClick={() => format('formatBlock', '<p>')}>
            P
          </Button>
          <Button variant="outline" size="sm" onClick={() => format('insertUnorderedList')}>
            • List
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="border border-muted rounded-md p-3 min-h-[120px] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Type here...
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalTextEditor;
