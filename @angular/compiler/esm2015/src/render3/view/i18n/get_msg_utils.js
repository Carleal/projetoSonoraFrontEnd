import { mapLiteral } from '../../../output/map_util';
import * as o from '../../../output/output_ast';
import { serializeIcuNode } from './icu_serializer';
import { i18nMetaToJSDoc } from './meta';
import { formatI18nPlaceholderName } from './util';
/** Closure uses `goog.getMsg(message)` to lookup translations */
const GOOG_GET_MSG = 'goog.getMsg';
export function createGoogleGetMsgStatements(variable, message, closureVar, params) {
    const messageString = serializeI18nMessageForGetMsg(message);
    const args = [o.literal(messageString)];
    if (Object.keys(params).length) {
        args.push(mapLiteral(params, true));
    }
    // /**
    //  * @desc description of message
    //  * @meaning meaning of message
    //  */
    // const MSG_... = goog.getMsg(..);
    // I18N_X = MSG_...;
    const googGetMsgStmt = closureVar.set(o.variable(GOOG_GET_MSG).callFn(args)).toConstDecl();
    const metaComment = i18nMetaToJSDoc(message);
    if (metaComment !== null) {
        googGetMsgStmt.addLeadingComment(metaComment);
    }
    const i18nAssignmentStmt = new o.ExpressionStatement(variable.set(closureVar));
    return [googGetMsgStmt, i18nAssignmentStmt];
}
/**
 * This visitor walks over i18n tree and generates its string representation, including ICUs and
 * placeholders in `{$placeholder}` (for plain messages) or `{PLACEHOLDER}` (inside ICUs) format.
 */
class GetMsgSerializerVisitor {
    formatPh(value) {
        return `{$${formatI18nPlaceholderName(value)}}`;
    }
    visitText(text) {
        return text.value;
    }
    visitContainer(container) {
        return container.children.map(child => child.visit(this)).join('');
    }
    visitIcu(icu) {
        return serializeIcuNode(icu);
    }
    visitTagPlaceholder(ph) {
        return ph.isVoid ?
            this.formatPh(ph.startName) :
            `${this.formatPh(ph.startName)}${ph.children.map(child => child.visit(this)).join('')}${this.formatPh(ph.closeName)}`;
    }
    visitPlaceholder(ph) {
        return this.formatPh(ph.name);
    }
    visitIcuPlaceholder(ph, context) {
        return this.formatPh(ph.name);
    }
}
const serializerVisitor = new GetMsgSerializerVisitor();
export function serializeI18nMessageForGetMsg(message) {
    return message.nodes.map(node => node.visit(serializerVisitor, null)).join('');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0X21zZ191dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3ZpZXcvaTE4bi9nZXRfbXNnX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRCxPQUFPLEtBQUssQ0FBQyxNQUFNLDRCQUE0QixDQUFDO0FBRWhELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDdkMsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRWpELGlFQUFpRTtBQUNqRSxNQUFNLFlBQVksR0FBRyxhQUFhLENBQUM7QUFFbkMsTUFBTSxVQUFVLDRCQUE0QixDQUN4QyxRQUF1QixFQUFFLE9BQXFCLEVBQUUsVUFBeUIsRUFDekUsTUFBc0M7SUFDeEMsTUFBTSxhQUFhLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0QsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBaUIsQ0FBQyxDQUFDO0lBQ3hELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUU7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDckM7SUFFRCxNQUFNO0lBQ04sa0NBQWtDO0lBQ2xDLGlDQUFpQztJQUNqQyxNQUFNO0lBQ04sbUNBQW1DO0lBQ25DLG9CQUFvQjtJQUNwQixNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDM0YsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLElBQUksV0FBVyxLQUFLLElBQUksRUFBRTtRQUN4QixjQUFjLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDL0M7SUFDRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUMvRSxPQUFPLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDOUMsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sdUJBQXVCO0lBQ25CLFFBQVEsQ0FBQyxLQUFhO1FBQzVCLE9BQU8sS0FBSyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ2xELENBQUM7SUFFRCxTQUFTLENBQUMsSUFBZTtRQUN2QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELGNBQWMsQ0FBQyxTQUF5QjtRQUN0QyxPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQsUUFBUSxDQUFDLEdBQWE7UUFDcEIsT0FBTyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsbUJBQW1CLENBQUMsRUFBdUI7UUFDekMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUNqRixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxFQUFvQjtRQUNuQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxFQUF1QixFQUFFLE9BQWE7UUFDeEQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLGlCQUFpQixHQUFHLElBQUksdUJBQXVCLEVBQUUsQ0FBQztBQUV4RCxNQUFNLFVBQVUsNkJBQTZCLENBQUMsT0FBcUI7SUFDakUsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgaTE4biBmcm9tICcuLi8uLi8uLi9pMThuL2kxOG5fYXN0JztcbmltcG9ydCB7bWFwTGl0ZXJhbH0gZnJvbSAnLi4vLi4vLi4vb3V0cHV0L21hcF91dGlsJztcbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vLi4vLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuXG5pbXBvcnQge3NlcmlhbGl6ZUljdU5vZGV9IGZyb20gJy4vaWN1X3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtpMThuTWV0YVRvSlNEb2N9IGZyb20gJy4vbWV0YSc7XG5pbXBvcnQge2Zvcm1hdEkxOG5QbGFjZWhvbGRlck5hbWV9IGZyb20gJy4vdXRpbCc7XG5cbi8qKiBDbG9zdXJlIHVzZXMgYGdvb2cuZ2V0TXNnKG1lc3NhZ2UpYCB0byBsb29rdXAgdHJhbnNsYXRpb25zICovXG5jb25zdCBHT09HX0dFVF9NU0cgPSAnZ29vZy5nZXRNc2cnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlR29vZ2xlR2V0TXNnU3RhdGVtZW50cyhcbiAgICB2YXJpYWJsZTogby5SZWFkVmFyRXhwciwgbWVzc2FnZTogaTE4bi5NZXNzYWdlLCBjbG9zdXJlVmFyOiBvLlJlYWRWYXJFeHByLFxuICAgIHBhcmFtczoge1tuYW1lOiBzdHJpbmddOiBvLkV4cHJlc3Npb259KTogby5TdGF0ZW1lbnRbXSB7XG4gIGNvbnN0IG1lc3NhZ2VTdHJpbmcgPSBzZXJpYWxpemVJMThuTWVzc2FnZUZvckdldE1zZyhtZXNzYWdlKTtcbiAgY29uc3QgYXJncyA9IFtvLmxpdGVyYWwobWVzc2FnZVN0cmluZykgYXMgby5FeHByZXNzaW9uXTtcbiAgaWYgKE9iamVjdC5rZXlzKHBhcmFtcykubGVuZ3RoKSB7XG4gICAgYXJncy5wdXNoKG1hcExpdGVyYWwocGFyYW1zLCB0cnVlKSk7XG4gIH1cblxuICAvLyAvKipcbiAgLy8gICogQGRlc2MgZGVzY3JpcHRpb24gb2YgbWVzc2FnZVxuICAvLyAgKiBAbWVhbmluZyBtZWFuaW5nIG9mIG1lc3NhZ2VcbiAgLy8gICovXG4gIC8vIGNvbnN0IE1TR18uLi4gPSBnb29nLmdldE1zZyguLik7XG4gIC8vIEkxOE5fWCA9IE1TR18uLi47XG4gIGNvbnN0IGdvb2dHZXRNc2dTdG10ID0gY2xvc3VyZVZhci5zZXQoby52YXJpYWJsZShHT09HX0dFVF9NU0cpLmNhbGxGbihhcmdzKSkudG9Db25zdERlY2woKTtcbiAgY29uc3QgbWV0YUNvbW1lbnQgPSBpMThuTWV0YVRvSlNEb2MobWVzc2FnZSk7XG4gIGlmIChtZXRhQ29tbWVudCAhPT0gbnVsbCkge1xuICAgIGdvb2dHZXRNc2dTdG10LmFkZExlYWRpbmdDb21tZW50KG1ldGFDb21tZW50KTtcbiAgfVxuICBjb25zdCBpMThuQXNzaWdubWVudFN0bXQgPSBuZXcgby5FeHByZXNzaW9uU3RhdGVtZW50KHZhcmlhYmxlLnNldChjbG9zdXJlVmFyKSk7XG4gIHJldHVybiBbZ29vZ0dldE1zZ1N0bXQsIGkxOG5Bc3NpZ25tZW50U3RtdF07XG59XG5cbi8qKlxuICogVGhpcyB2aXNpdG9yIHdhbGtzIG92ZXIgaTE4biB0cmVlIGFuZCBnZW5lcmF0ZXMgaXRzIHN0cmluZyByZXByZXNlbnRhdGlvbiwgaW5jbHVkaW5nIElDVXMgYW5kXG4gKiBwbGFjZWhvbGRlcnMgaW4gYHskcGxhY2Vob2xkZXJ9YCAoZm9yIHBsYWluIG1lc3NhZ2VzKSBvciBge1BMQUNFSE9MREVSfWAgKGluc2lkZSBJQ1VzKSBmb3JtYXQuXG4gKi9cbmNsYXNzIEdldE1zZ1NlcmlhbGl6ZXJWaXNpdG9yIGltcGxlbWVudHMgaTE4bi5WaXNpdG9yIHtcbiAgcHJpdmF0ZSBmb3JtYXRQaCh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYHskJHtmb3JtYXRJMThuUGxhY2Vob2xkZXJOYW1lKHZhbHVlKX19YDtcbiAgfVxuXG4gIHZpc2l0VGV4dCh0ZXh0OiBpMThuLlRleHQpOiBhbnkge1xuICAgIHJldHVybiB0ZXh0LnZhbHVlO1xuICB9XG5cbiAgdmlzaXRDb250YWluZXIoY29udGFpbmVyOiBpMThuLkNvbnRhaW5lcik6IGFueSB7XG4gICAgcmV0dXJuIGNvbnRhaW5lci5jaGlsZHJlbi5tYXAoY2hpbGQgPT4gY2hpbGQudmlzaXQodGhpcykpLmpvaW4oJycpO1xuICB9XG5cbiAgdmlzaXRJY3UoaWN1OiBpMThuLkljdSk6IGFueSB7XG4gICAgcmV0dXJuIHNlcmlhbGl6ZUljdU5vZGUoaWN1KTtcbiAgfVxuXG4gIHZpc2l0VGFnUGxhY2Vob2xkZXIocGg6IGkxOG4uVGFnUGxhY2Vob2xkZXIpOiBhbnkge1xuICAgIHJldHVybiBwaC5pc1ZvaWQgP1xuICAgICAgICB0aGlzLmZvcm1hdFBoKHBoLnN0YXJ0TmFtZSkgOlxuICAgICAgICBgJHt0aGlzLmZvcm1hdFBoKHBoLnN0YXJ0TmFtZSl9JHtwaC5jaGlsZHJlbi5tYXAoY2hpbGQgPT4gY2hpbGQudmlzaXQodGhpcykpLmpvaW4oJycpfSR7XG4gICAgICAgICAgICB0aGlzLmZvcm1hdFBoKHBoLmNsb3NlTmFtZSl9YDtcbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXIocGg6IGkxOG4uUGxhY2Vob2xkZXIpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmZvcm1hdFBoKHBoLm5hbWUpO1xuICB9XG5cbiAgdmlzaXRJY3VQbGFjZWhvbGRlcihwaDogaTE4bi5JY3VQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0UGgocGgubmFtZSk7XG4gIH1cbn1cblxuY29uc3Qgc2VyaWFsaXplclZpc2l0b3IgPSBuZXcgR2V0TXNnU2VyaWFsaXplclZpc2l0b3IoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUkxOG5NZXNzYWdlRm9yR2V0TXNnKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSk6IHN0cmluZyB7XG4gIHJldHVybiBtZXNzYWdlLm5vZGVzLm1hcChub2RlID0+IG5vZGUudmlzaXQoc2VyaWFsaXplclZpc2l0b3IsIG51bGwpKS5qb2luKCcnKTtcbn1cbiJdfQ==