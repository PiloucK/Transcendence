"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const BLOG_POSTS = [
    { title: 'Lorem Ipsum', id: 1 },
    { title: 'Dolore Sit', id: 2 },
    { title: 'Ame', id: 3 },
];
let AppService = class AppService {
    getBlogPosts() {
        return (0, rxjs_1.from)(BLOG_POSTS).pipe((0, rxjs_1.toArray)());
    }
    getBlogPost(postId) {
        const blogPost = BLOG_POSTS.find(({ id }) => id === postId);
        if (!blogPost) {
            throw new common_1.NotFoundException();
        }
        return (0, rxjs_1.of)(blogPost);
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.services.js.map