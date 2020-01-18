import { async, TestBed } from '@angular/core/testing';

import { <%= classify(name) %>Component } from './<%= name %>.component';

describe('<%= classify(name) %>Component Class', () => {
  let component: <%= classify(name) %>Component;

  // Stubs

  // Mocks

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        <%= classify(name) %>Component,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.get(<%= classify(name) %>Component);
  });

  it('should create an instance', () => {
    expect(component).toBeDefined();
  });
<% for (let method of methods) { if (method.branches.length == 0) { %>
    <%= createTests(method)%>
  <% } else { for (let branch of method.branches) { %>
      <%= createTestsRec(branch, method.methodName + ' should do <') %>
    <% } } } %>
});
