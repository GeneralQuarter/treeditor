import { Rectangle } from '@treeditor/models/rectangle';

export function dimensionsText(rectangle: Rectangle): string {
  return `${rectangle.width}m x ${rectangle.length}m`;
}