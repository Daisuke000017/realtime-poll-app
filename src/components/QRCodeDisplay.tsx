'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface QRCodeDisplayProps {
  url: string;
  title?: string;
  showActions?: boolean;
}

export function QRCodeDisplay({ url, title = '投票URL', showActions = true }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = 'qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <QRCodeSVG
            id="qr-code-svg"
            value={url}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        {showActions && (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  コピーしました
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  URLをコピー
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        )}

        <p className="text-xs text-gray-500 break-all text-center">{url}</p>
      </CardContent>
    </Card>
  );
}
